import { Amplify } from "aws-amplify";
import {
  fetchAuthSession,
  getCurrentUser,
  resendSignUpCode,
  signIn,
} from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Banner, BannerContent } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Description, FieldControl, Label } from "@/components/ui/fieldset";
import { InputField, PasswordInput } from "@/components/ui/input";
import { Strong, Text, TextLink, Title } from "@/components/ui/text";
import { toaster } from "@/components/ui/toast";
import { CognitoAuthService } from "@/features/auth/cognito/api/endpoints";
import { getErrorMessage } from "@/libs/query/query-error";

/**
 * TODO:
 * []-Handle use-case where sign in confirmation is outside app (e.g. Cognito send an email to user tha confirms their sign in).
 */
export const Route = createFileRoute("/(unauthenticated)/login")({
  component: App,
  async loader() {
    try {
      await getCurrentUser();

      return redirect({ to: "/home" });
    } catch {
      const config = Amplify.getConfig();

      return { config };
    }
  },
});

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

function App() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      username: "neil+congnitomvp@ingenuity.ph",
      password: "Password1!",
    },
    resolver: zodResolver(schema),
  });

  const validateToken = CognitoAuthService.validateToken.useMutation();
  const onSubmitHandler = form.handleSubmit(async (data) => {
    const result = await signIn({
      username: data.username,
      password: data.password,
    }).catch((error) => {
      form.setError("root", { message: getErrorMessage(error) });

      return null;
    });

    if (!result) {
      return;
    }
    const nextStep = result.nextStep.signInStep;

    if (nextStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({ username: data.username });
      void navigate({
        to: "/confirm-account",
        search: { email: data.username },
      });
    } else if (nextStep === "DONE") {
      // send to BE to validate and return as cookie
      const session = await fetchAuthSession();

      const token = session.tokens?.accessToken.toString();

      if (token) {
        validateToken.mutate(
          { token },
          {
            onSuccess() {
              void navigate({ to: "/home" });
            },
            onError(error) {
              toaster.error(getErrorMessage(error));
              form.setError("root", { message: getErrorMessage(error) });
            },
          }
        );
      }
    }
  });

  const rootError = form.formState.errors.root?.message;
  const isLoading = validateToken.isPending || form.formState.isSubmitting;

  return (
    <AuthLayout>
      <form
        className="grid w-full max-w-sm grid-cols-1 gap-8"
        onSubmit={onSubmitHandler}
      >
        <span className="bg-brand-primary inline rounded px-3 pt-3 pb-2.5">
          <img
            src="https://www.ingenuity.ph/wp-content/uploads/2024/02/ingenuity-logo-2020_-light.png"
            alt="Ingenuity"
            className="h-8"
          />
        </span>
        <Title>Sign in to your account</Title>
        {rootError !== undefined && (
          <Banner>
            <BannerContent>
              <Label>Login Error</Label>
              <Description>{rootError}</Description>
            </BannerContent>
          </Banner>
        )}
        <InputField
          control={form.control}
          field="username"
          label="Email Address"
        />
        <FieldControl control={form.control} field="password">
          <Label>Password</Label>
          <PasswordInput type="password" name="password" />
        </FieldControl>
        <div className="flex items-center justify-between">
          {/* <CheckboxField label="Remember me" /> */}
          <Text className="ml-auto">
            <TextLink to="/reset-password">
              <Strong>Forgot password?</Strong>
            </TextLink>
          </Text>
        </div>
        <Button type="submit" className="w-full" isPending={isLoading}>
          Login
        </Button>
        <Text>
          Don’t have an account?{" "}
          <TextLink to="/register">
            <Strong>Sign up</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
}
