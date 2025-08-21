"use client";
import clsx from "clsx";
import { useEffect } from "react";
import { toast } from "sonner";
import { ConfirmEmailCard } from "@/features/auth/components/ConfirmEmailCard";
import GoggleOAuth from "@/features/auth/components/GoggleOAuth";
import { useRegisterForm } from "@/features/auth/hooks/useRegistrationForm";
import { useRegisterFormStore } from "@/features/auth/model/RegisterFormStore";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface IRegistryFormProps {
  className?: string;
}
export const RegisterForm = ({ className }: IRegistryFormProps) => {
  const { stage, setStage } = useRegisterFormStore();
  const { onSubmitCredentials, onSubmitVerified, errors } = useRegisterForm();
  useEffect(() => {
    errors.forEach((error) => {
      const title = error.title.charAt(0).toUpperCase() + error.title.slice(1);
      toast.error(title, { description: error.message });
    });
  }, [errors]);

  if (stage === "credentials") {
    return (
      <Card className={clsx(className)}>
        <CardHeader>
          <span className="text-center font-bold text-3xl">Register</span>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmitCredentials}>
            <div className="grid gap-1.5">
              <Label htmlFor="avatar">Avatar</Label>
              <Input id="avatar" type="file" name="pfp" multiple={false} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="tag">Tag</Label>
              <Input id="tag" name="tag" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" />
            </div>
            <Button
              variant="ghost"
              className="mt-3 cursor-pointer !bg-chart-1 text-sidebar-primary-foreground hover:opacity-90 hover:text-sidebar-primary-foreground duration-500"
              type="submit"
            >
              Sign up
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <GoggleOAuth />
        </CardFooter>
      </Card>
    );
  }
  return (
    <ConfirmEmailCard
      className={clsx(className)}
      setStage={setStage}
      onSubmit={onSubmitVerified}
    />
  );
};
