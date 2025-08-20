"use client";
import clsx from "clsx";
import { MoveLeft } from "lucide-react";
import type { StageForm } from "@/features/auth/interface/StageForm";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export const ConfirmEmailCard = ({
  onSubmit,
  setStage,
  className,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setStage: (value: StageForm) => void;
  className?: string;
}) => {
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
        <form onSubmit={onSubmit} className="flex flex-col gap-y-4 mt-4">
          <div className="grid gap-2.5">
            <Label htmlFor="token">Verification code</Label>
            <Input id="token" name="token" />
          </div>
          <Button className="cursor-pointer" type="submit">
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
