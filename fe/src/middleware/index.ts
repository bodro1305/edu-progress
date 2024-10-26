import { authCookieOption } from "@/constant/cookie-option";
import api from "@/lib/api.lib";
import { defineMiddleware } from "astro:middleware";
import micromatch from "micromatch";

const roleProtectedRoutes = {
  admin: ["/admin/**"],
  regular: ["/dashboard/**"],
};

const defaultDashboards = {
  admin: "/admin",
  regular: "/dashboard",
};

const getUserData = async (accessToken: string) => {
  try {
    const { data } = await api(
      { url: "/user/me", method: "GET" },
      { accessToken },
    );
    return data.data.user;
  } catch (error) {
    return null;
  }
};

const isProtectedRoute = (pathname: string) => {
  const allProtectedRoutes = Object.values(roleProtectedRoutes).flat();
  return micromatch.isMatch(pathname, allProtectedRoutes);
};

const hasAccess = (pathname: string, userRole: string) => {
  return roleProtectedRoutes[userRole]
    ? micromatch.isMatch(pathname, roleProtectedRoutes[userRole])
    : false;
};

export const onRequest = defineMiddleware(
  async ({ locals, url, cookies, redirect }, next) => {
    const accessToken = cookies.get("accessToken")?.value;
    locals.user = {};
    locals.accessToken = null;
    if (isProtectedRoute(url.pathname)) {
      if (!accessToken) return redirect("/login");

      const user = await getUserData(accessToken);
      if (!user) {
        cookies.delete("accessToken");
        return redirect("/login?login_status=EXPIRED");
      }

      locals.user = user;

      if (!hasAccess(url.pathname, user.role)) {
        return redirect(defaultDashboards[user.role]);
      }
    }

    if (url.pathname === "/login" && accessToken) {
      const user = await getUserData(accessToken);
      if (!user) {
        cookies.delete("accessToken", authCookieOption);
        return redirect("/login?login_status=EXPIRED");
      }
      return redirect(defaultDashboards[user.role]);
    }

    locals.user = await getUserData(accessToken);
    locals.accessToken = accessToken;
    return next();
  },
);
