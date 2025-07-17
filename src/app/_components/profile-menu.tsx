"use client";

import { LogIn, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useLayoutEffect } from "react";
import {
  type AuthData,
  setAuth,
  signOut,
  useAuth,
} from "~/modules/auth/client";
import { Menu, MenuItem, MenuSeparator } from "~/shared/components/menu";
import { ThemeSwitch } from "./theme-switch";

function UserProfileMenuTrigger() {
  const [auth] = useAuth();

  return (
    <button type="button" className="rounded-full h-[32px] w-[32px]">
      {auth?.pfp ? (
        <Image
          src={auth.pfp}
          alt="Profile"
          width={32}
          height={32}
          unoptimized
        />
      ) : (
        <User className="w-full h-full" />
      )}
    </button>
  );
}

function UserProfileMenu() {
  const [, setAuth] = useAuth();

  return (
    <Menu trigger={UserProfileMenuTrigger} align="end" gap={4} className="w-48">
      <MenuItem>Profile TODO</MenuItem>
      <MenuItem>Chats TODO</MenuItem>
      <MenuItem>Settings TODO</MenuItem>

      <MenuSeparator />

      <ThemeSwitch />

      <MenuSeparator />

      <button
        type="button"
        className="w-full"
        onClick={() => signOut().then(() => setAuth(null))}
      >
        <MenuItem className="text-red-600">
          <LogOut className="w-5" />
          <h4>Sign Out</h4>
        </MenuItem>
      </button>
    </Menu>
  );
}

function LoginButton() {
  return (
    <Link
      href="/sign-in"
      className="flex items-center justify-center rounded-full h-[32px] w-[32px] hover:bg-active"
    >
      <LogIn className="w-6" />
    </Link>
  );
}

namespace ProfileMenu {
  export interface Props {
    user: Promise<AuthData | null>;
  }
}

export function ProfileMenu({ user }: ProfileMenu.Props) {
  const me = use(user);

  useLayoutEffect(() => setAuth(me), [me]);

  if (!me) {
    return <LoginButton />;
  }

  return <UserProfileMenu />;
}
