import { PrismaService } from '@/common/service/prisma.service';
import {
  CREATE_USER_SCHEMA,
  UPDATE_USER_SCHEMA,
} from '@/zod-schema/user.zod-schema';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CREATE_USER_SCHEMA) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const userData: Prisma.UserCreateInput = {
      username: data.username,
      full_name: data.full_name,
      password: await argon2.hash(data.password),
      is_substitute: data.is_substitute,
      lessons: {
        createMany: {
          data: data.lessons.map((lesson) => ({ name: lesson })),
        },
      },
    };

    if (data.is_substitute) {
      userData.substitute = {
        create: { day: data.substitute },
      };
    }

    const newUser = await this.prisma.user.create({
      data: userData,
      omit: {
        password: true,
      },
    });

    return newUser;
  }

  async updateUserByPublicId(publicId: string, data: UPDATE_USER_SCHEMA) {
    const userExistsPromise = this.prisma.user.findUnique({
      where: { public_id: publicId },
      include: { lessons: true, substitute: true },
    });

    const usernameExistsPromise = data.username
      ? this.prisma.user.findUnique({ where: { username: data.username } })
      : Promise.resolve(null);

    const [user, existingUser] = await Promise.all([
      userExistsPromise,
      usernameExistsPromise,
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (existingUser) {
      throw new ConflictException('Username already taken');
    }

    const userUpdate: Prisma.UserUpdateInput = {};

    if (data.password) {
      userUpdate.password = await argon2.hash(data.password);
    }
    if (data.username) {
      userUpdate.username = data.username;
    }
    if (data.full_name) {
      userUpdate.full_name = data.full_name;
    }
    if (data.is_substitute !== undefined) {
      userUpdate.is_substitute = data.is_substitute;
    }

    // Menggunakan transaksi untuk memperbarui pengguna dan operasional lain
    return await this.prisma.$transaction(async (prisma) => {
      if (data.lessons) {
        await prisma.lesson.deleteMany({
          where: { user_public_id: publicId },
        });

        userUpdate.lessons = {
          createMany: {
            data: data.lessons.map((lesson) => ({ name: lesson })),
          },
        };
      }

      if (data.is_substitute) {
        if (user.substitute.length !== 0) {
          userUpdate.substitute = {
            upsert: {
              where: { id: user.substitute[0].id },
              create: { day: data.substitute },
              update: { day: data.substitute },
            },
          };
        } else {
          userUpdate.substitute = {
            create: { day: data.substitute },
          };
        }
      } else if (user.substitute) {
        userUpdate.substitute = {
          delete: { id: user.substitute[0].id },
        };
      }

      return await prisma.user.update({
        where: { public_id: publicId },
        data: userUpdate,
        select: this.userSelectFields(),
      });
    });
  }

  async getUserByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: this.userSelectFields(),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserByPublicId(publicId: string) {
    const user = await this.prisma.user.findUnique({
      where: { public_id: publicId },
      select: this.userSelectFields(),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUsersByRole(role: 'admin' | 'regular') {
    const users = await this.prisma.user.findMany({
      where: { role },
      select: {
        full_name: true,
        username: true,
        public_id: true,
        lessons: {
          select: {
            lesson_public_id: true,
            name: true,
          },
        },
        journals_filled: true,
        journals_substituted: true,
      },
      //   include: { lessons: true },
    });

    return users;
  }

  async deleteUserByPublicId(publicId: string) {
    const user = await this.prisma.user.findUnique({
      where: { public_id: publicId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { public_id: publicId },
    });

    return {
      message: `User with public ID '${publicId}' has been deleted successfully`,
    };
  }

  async deleteManyUsersByPublicId(publicIds: string[]) {
    if (publicIds.length === 0) {
      throw new BadRequestException('Public ID array cannot be empty');
    }

    const result = await this.prisma.user.deleteMany({
      where: {
        public_id: { in: publicIds },
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('No users were found to delete');
    }

    return result;
  }

  private userSelectFields() {
    return {
      full_name: true,
      username: true,
      role: true,
      lessons: { select: { name: true, lesson_public_id: true } },
      substitute: { select: { day: true } },
    };
  }
}
