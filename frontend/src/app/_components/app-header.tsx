import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { AppThemeSwitcher } from "@/app/_components/app-theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { LinkButton } from "@/shared/ui/link";
import { AppSidebarButton } from "./app-sidebar";

const isAccount: boolean = true;
export const AppHeader = () => {
  return (
    <header className="container-custom flex justify-between items-center gap-x-4">
      <div className="flex gap-1 items-center">
        {isAccount && (
          <>
            <AppSidebarButton />
            <span className="font-extrabold text-foreground">/</span>
          </>
        )}
        <LinkButton className="px-2 w-10" variant="ghost" href="/">
          <Image width={26} height={26} src="/favicon.ico" alt="logo" />
        </LinkButton>
      </div>

      <div className="flex items-center gap-x-2">
        <AppThemeSwitcher />
        {isAccount ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-max cursor-pointer rounded-full p-1"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 flex flex-col" align="start">
              <DropdownMenuLabel className="truncate">
                123456789@gmail.com
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <LinkButton
                className="justify-start text-sm"
                href="#"
                variant="ghost"
              >
                <User />
                Profile
              </LinkButton>
              <Button
                variant="destructive"
                className="cursor-pointer justify-start text-sm"
              >
                <LogOut />
                Sign On
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <LinkButton href="#" className="h-8" variant="outline">
              sign in
            </LinkButton>
            <LinkButton href="#" className="h-8" variant="default">
              sign up
            </LinkButton>
          </>
        )}
      </div>
    </header>
  );
};
