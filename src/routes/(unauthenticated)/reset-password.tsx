import { confirmResetPassword, resetPassword } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Banner, BannerContent } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import {
  Description,
  FieldControl,
  FieldGroup,
  Label,
} from "@/components/ui/fieldset";
import { InputField, PasswordInput } from "@/components/ui/input";
import { Stepper, useStep } from "@/components/ui/stepper";
import { Strong, Text, TextLink, Title } from "@/components/ui/text";
import { getErrorMessage } from "@/libs/query/query-error";

export const Route = createFileRoute("/(unauthenticated)/reset-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthLayout>
      <Stepper>
        <ResetPasswordForm />
        <ChangePasswordForm />
      </Stepper>
    </AuthLayout>
  );
}

function ResetPasswordForm() {
  const step = useStep();
  const form = useForm({
    defaultValues: { email: "" },
    resolver: zodResolver(
      z.object({
        email: z.string(),
      })
    ),
  });

  const onSubmitHandler = form.handleSubmit(async (data) => {
    try {
      await resetPassword({ username: data.email });
      step.nextStep();
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  });
  const rootError = form.formState.errors.root?.message;

  return (
    <form
      className="grid w-full max-w-sm grid-cols-1 gap-8"
      onSubmit={onSubmitHandler}
    >
      {rootError !== undefined && (
        <Banner>
          <BannerContent>
            <Label>Login Error</Label>
            <Description>{rootError}</Description>
          </BannerContent>
        </Banner>
      )}

      {/*TODO: Improve Copy  */}
      <div>
        <Title>Reset Password</Title>
        <Description>
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </Description>
      </div>
      <InputField
        type="email"
        control={form.control}
        field="email"
        label="Email"
        name="email"
      />
      <Button
        type="submit"
        className="w-full"
        isPending={form.formState.isSubmitting}
      >
        Send Link
      </Button>
      <Text className="text-center">
        Return to{" "}
        <TextLink to={"/login"}>
          <Strong>Login</Strong>
        </TextLink>
      </Text>
    </form>
  );
}

function ChangePasswordForm() {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string(),
        code: z.string(),
        newPassword: z.string(),
        confirmNewPassword: z.string(),
      })
    ),
  });
  const onSubmitHandler = form.handleSubmit(async (data) => {
    await confirmResetPassword({
      confirmationCode: data.code,
      newPassword: data.newPassword,
      username: data.email,
    });
  });

  return (
    <AuthLayout>
      <form
        className="grid w-full max-w-sm grid-cols-1 gap-8"
        onSubmit={onSubmitHandler}
      >
        {/*TODO: Improve Copy  */}
        <Title>Update your Password</Title>
        <FieldGroup>
          <FieldControl control={form.control} field="newPassword">
            <Label>New Password</Label>
            <PasswordInput />
          </FieldControl>
          <FieldControl control={form.control} field="confirmNewPassword">
            <Label>Confirm New Password</Label>
            <PasswordInput />
          </FieldControl>
        </FieldGroup>
        <Button
          type="submit"
          className="w-full"
          isPending={form.formState.isSubmitting}
        >
          Update Password
        </Button>
      </form>
    </AuthLayout>
  );
}
