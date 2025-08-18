"use client";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import clsx from "clsx";
import { jwtDecode } from "jwt-decode";
import { MoveLeft } from "lucide-react";
import React from "react";
import GoggleOAuth from "@/features/auth/components/GoggleOAuth";
import { useLoginFormStore } from "@/features/auth/model/LoginFormStore";
import { useLoginForm } from "@/features/auth/model/useLoginForm";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import { Divider } from "@/shared/ui/custom/divider";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface ILoginFormProps {
  className?: string;
}
export const LoginForm = ({ className }: ILoginFormProps) => {
  const { stage, setStage } = useLoginFormStore();
  const {
    registerCredentials,
    handleSubmitCredentials,
    onSubmitCredentials,

    registerVerification,
    handleSubmitVerification,
    onSubmitVerification,
  } = useLoginForm();
  if (stage === "credentials") {
    return (
      <Card className={clsx(className)}>
        <CardHeader>
          <span className="text-center font-bold text-3xl">Login</span>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={handleSubmitCredentials(onSubmitCredentials)}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                {...registerCredentials("email", { required: true })}
              ></Input>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...registerCredentials("password", { required: true })}
              ></Input>
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
    <Card className={clsx(className)}>
      <CardContent>
        <Button
          onClick={() => {
            setStage("credentials");
          }}
          className="max-w-max"
          type="button"
          variant="outline"
        >
          <MoveLeft />
        </Button>
        <form
          onSubmit={handleSubmitVerification(onSubmitVerification)}
          className="flex flex-col gap-y-4 mt-4"
        >
          <div className="grid gap-2.5">
            <Label htmlFor="verification-code">Verification code</Label>
            <Input
              id="verification-code"
              type="verification-code"
              {...registerVerification("code", { required: true })}
            />
          </div>
          <Button className="cursor-pointer" type="submit">
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
