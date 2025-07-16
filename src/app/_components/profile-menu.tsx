import { LogOut } from "lucide-react";
import Image from "next/image";

import { Menu, MenuItem, MenuSeparator } from "~/shared/components/menu";
import { ThemeSwitch } from "./theme-switch";

function ProfileMenuTrigger() {
  return (
    <button type="button" className="rounded-full h-[32px] w-[32px]">
      <Image
        src="http://localhost"
        alt="Profile"
        width={32}
        height={32}
        unoptimized
      />
    </button>
  );
}

export function ProfileMenu() {
  return (
    <Menu trigger={<ProfileMenuTrigger />} align="end" gap={4} className="w-48">
      <MenuItem>Profile TODO</MenuItem>
      <MenuItem>Chats TODO</MenuItem>
      <MenuItem>Settings TODO</MenuItem>

      <MenuSeparator />

      <ThemeSwitch />

      <MenuSeparator />

      <MenuItem className="text-red-600">
        <LogOut className="w-5" />
        <h4>Sign Out TODO</h4>
      </MenuItem>
    </Menu>
  );
}
