"use client";
import clsx from "clsx";
import { useEffect } from "react";
import { toast } from "sonner";
import { ConfirmEmailCard } from "@/features/auth/components/ConfirmEmailCard";
import GoggleOAuth from "@/features/auth/components/GoggleOAuth";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import { useLoginFormStore } from "@/features/auth/model/LoginFormStore";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface ILoginFormProps {
  className?: string;
}
export const LoginForm = ({ className }: ILoginFormProps) => {
  const { stage, setStage } = useLoginFormStore();
  const { onSubmitCredentials, onSubmitVerified, errors } = useLoginForm();
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
          <span className="text-center font-bold text-3xl">Login</span>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmitCredentials}>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email"></Input>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password"></Input>
            </div>
            <Button
              variant="ghost"
              className="mt-3 cursor-pointer !bg-chart-1 text-sidebar-primary-foreground hover:opacity-90 hover:text-sidebar-primary-foreground duration-500"
            >
              Sign in
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
