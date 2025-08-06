import { autoSignIn, confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Description, FieldControl, Label } from "@/components/ui/fieldset";
import { Title } from "@/components/ui/text";
import { toaster } from "@/components/ui/toast";
import { Content } from "@/components/ui/view";
import { PinCodeInput } from "@/features/auth/components/PinInput";
import { getErrorMessage } from "@/libs/query/query-error";

const searchParamsSchema = z.object({
  email: z.string().email(),
});

export const Route = createFileRoute("/(unauthenticated)/confirm-account")({
  component: RouteComponent,
  validateSearch: zodValidator(searchParamsSchema),
});

const schema = z.object({
  code: z.string().min(1, "Required"),
  email: z.string().email(),
});

/**
 * TODO: warning when navigating or closing tab.
 */
function RouteComponent() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: { email },
    resolver: zodResolver(schema),
  });
  const onSubmitHandler = form.handleSubmit(async (data) => {
    try {
      const result = await confirmSignUp({
        confirmationCode: data.code,
        username: data.email,
      });

      if (result.isSignUpComplete) {
        return void navigate({ to: "/home" });
      }
      switch (result.nextStep.signUpStep) {
        case "COMPLETE_AUTO_SIGN_IN": {
          // TODO: Error handling handle response
          await autoSignIn();

          break;
        }
        case "CONFIRM_SIGN_UP": {
          // void navigate({ to: "/home" });
          break;
        }
        case "DONE": {
          // TODO: Handle integration to authenticate with BE
          return void navigate({ to: "/home" });
        }
        default: {
          // TODO: Handle default
          break;
        }
      }
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  });

  const rootError = form.formState.errors.root?.message;

  return (
    <AuthLayout>
      <form
        className="grid w-full max-w-sm grid-cols-1 gap-8"
        onSubmit={onSubmitHandler}
      >
        <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
        <span className="bg-brand-primary inline rounded px-3 pt-3 pb-2.5">
          <img
            src="https://www.ingenuity.ph/wp-content/uploads/2024/02/ingenuity-logo-2020_-light.png"
            alt="Ingenuity"
            className="h-8"
          />
        </span>
        <div>
          <Title>Complete Sign-up</Title>
          <Description>
            We&apos;ve sent a verification code to your email. Enter the code
            below to continue.
          </Description>
        </div>
        {rootError !== undefined && (
          <Banner>
            <Content>
              <Label>Login Error</Label>
              <Description>{rootError}</Description>
            </Content>
          </Banner>
        )}
        <FieldControl
          control={form.control}
          field="code"
          aria-label="Confirmation Code"
        >
          <PinCodeInput mask />
        </FieldControl>

        <div className="space-y-1">
          <Button
            type="submit"
            className="w-full"
            isPending={form.formState.isSubmitting}
          >
            Confirm Account
          </Button>
          <Button
            variant="plain"
            className="w-full"
            isDisabled={form.formState.isSubmitting}
            onPress={() => {
              // TODO: Error Handling
              void resendSignUpCode({ username: email });
              toaster.success("Code Sent");
            }}
          >
            Resend Code
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
