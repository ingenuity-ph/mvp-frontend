import { fetchAuthSession, resendSignUpCode, signIn } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { InputField, PasswordInputField } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { Text, TextLink, Title } from "@/components/ui/text";
import { toaster } from "@/components/ui/toast";
import { CognitoAuthService } from "@/features/auth/cognito/api/endpoints";
import { getErrorMessage } from "@/libs/query/query-error";
import { MutationErrorBanner } from "@/libs/query/query-resolver";

/**
 * TODO:
 * []-Handle use-case where sign in confirmation is outside app (e.g. Cognito send an email to user tha confirms their sign in).
 */

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export function LoginFlowForm() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      // TODO: Remove hardcoded value
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
      //TODO: send to BE to validate and return as cookie
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
              toaster(getErrorMessage(error));
              form.setError("root", { message: getErrorMessage(error) });
            },
          },
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
        <span className="bg-brand-primary inline rounded p-4">
          <img
            src="https://www.ingenuity.ph/wp-content/uploads/2024/02/ingenuity-logo-2020_-light.png"
            alt="Ingenuity"
            className="h-5"
          />
        </span>
        <Title>Sign in to your account</Title>
        <MutationErrorBanner errorMessage={rootError} label="Login Error" />
        <InputField
          control={form.control}
          field="username"
          label="Email Address"
        />
        <PasswordInputField
          control={form.control}
          field="password"
          label="Password"
        />
        <div className="flex items-center justify-between">
          <TextLink
            to="/reset-password"
            className="ml-auto font-medium hover:text-neutral-700 hover:underline"
          >
            Forgot password?
          </TextLink>
        </div>
        <Button type="submit" className="w-full" isPending={isLoading}>
          Login
        </Button>
        <Text>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium hover:text-neutral-700">
            Sign Up
          </Link>
        </Text>
      </form>
    </AuthLayout>
  );
}
