import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { ZodSchema } from '@/common/decorator/zod-schema.decorator';
import {
  CREATE_USER_SCHEMA,
  DELETE_USERS_SCHEMA,
  UPDATE_USER_SCHEMA,
} from '@/zod-schema/user.zod-schema';
import { Role } from '@/auth/decorator/role.decorator';
import { Public } from '@/auth/decorator/public.decorator';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Role('regular')
  @Get('/r')
  async getRegularUsersForRegular(@Req() req) {
    const users = await this.userService.getUsersByRole('regular');

    const filteredUsers = users.filter(
      (user) => user.public_id !== req.user.public_id,
    );

    return {
      payload: {
        users: filteredUsers,
        count: filteredUsers.length,
      },
    };
  }

  @Get('/me')
  async getMe(@Req() req: Request) {
    return {
      payload: {
        user: req.user,
      },
    };
  }

  @Public()
  //@Role('admin')
  @Post('/')
  async createUser(
    @ZodSchema(CREATE_USER_SCHEMA) @Body() createUserDto: CREATE_USER_SCHEMA,
  ) {
    const user = await this.userService.createUser(createUserDto);
    return {
      payload: { user },
    };
  }

  @Get(':publicId')
  @Role('admin')
  async getUserByPublicId(@Param('publicId') publicId: string) {
    const user = await this.userService.getUserByPublicId(publicId);
    return {
      payload: { user },
    };
  }

  @Delete(':publicId')
  @Role('admin')
  async deleteUserByPublicId(@Param('publicId') publicId: string) {
    await this.userService.deleteUserByPublicId(publicId);
    return {
      message: `User with public ID '${publicId}' has been deleted successfully.`,
    };
  }

  @Delete('/')
  @Role('admin')
  async deleteManyUsersByPublicId(
    @ZodSchema(DELETE_USERS_SCHEMA) @Body() deleteUserDto: DELETE_USERS_SCHEMA,
  ) {
    const result = await this.userService.deleteManyUsersByPublicId(
      deleteUserDto.public_ids,
    );
    return {
      message: `${result.count} users have been deleted successfully.`,
    };
  }

  @Patch(':publicId')
  @Role('admin')
  async updateUserByPublicId(
    @Param('publicId') publicId: string,
    @ZodSchema(UPDATE_USER_SCHEMA) @Body() updateUserDto: UPDATE_USER_SCHEMA,
  ) {
    const updatedUser = await this.userService.updateUserByPublicId(
      publicId,
      updateUserDto,
    );
    return {
      payload: { user: updatedUser },
    };
  }

  @Get('/')
  @Role('admin')
  async getRegularUsers() {
    const users = await this.userService.getUsersByRole('regular');
    return {
      payload: {
        users,
        count: users.length,
      },
    };
  }
}
