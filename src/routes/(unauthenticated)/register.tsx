import { Amplify, type ResourcesConfig } from "aws-amplify";
import { signUp } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { Strong, Text, TextLink, Title } from "@/components/ui/text";
import { getErrorMessage } from "@/libs/query/query-error";

type AuthConfig = NonNullable<ResourcesConfig["Auth"]>;
type CognitoConfig = NonNullable<AuthConfig["Cognito"]>;
type PasswordSettings = CognitoConfig["passwordFormat"];
// Cognito does not allow a password length less then 8 characters
const DEFAULT_COGNITO_PASSWORD_MIN_LENGTH = 8;

/**
 * List of special characters that Cognito allows.
 *
 * Adapted from https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html.
 */
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/naming-convention
const ALLOWED_SPECIAL_CHARACTERS = [
    '^',  '$', '*', '.', '[', ']',
    '{',  '}', '(', ')', '?', '"',
    '!',  '@', '#', '%', '&', '/',
    '\\', ',', '>', '<', "'", ':',
    ';',  '|', '_', '~', '`', '=',
    '+',  '-', ' '
  ];

// eslint-disable-next-line jsdoc/require-description
/**
 * @param config - The password configuration from Cognito.
 * @returns A Zod string schema for password validation.
 */
function buildSchema(config: PasswordSettings) {
  const baseSchema = z.object({
    email: z.string().email(),
    confirmPassword: z.string(),
    password: z.string(),
  });

  let passwordSchema = z.string();

  const {
    minLength = DEFAULT_COGNITO_PASSWORD_MIN_LENGTH,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    requireLowercase,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    requireNumbers,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    requireUppercase,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    requireSpecialCharacters,
  } = config ?? {};

  // Apply minimum length constraint if specified
  passwordSchema = passwordSchema.min(
    minLength,
    `Password must be at least ${minLength} characters long.`
  );

  // Conditionally add regex for required character types
  if (requireLowercase) {
    passwordSchema = passwordSchema.regex(
      /[a-z]/,
      "Password must contain at least one lowercase letter."
    );
  }

  if (requireUppercase) {
    passwordSchema = passwordSchema.regex(
      /[A-Z]/,
      "Password must contain at least one uppercase letter."
    );
  }

  if (requireNumbers) {
    passwordSchema = passwordSchema.regex(
      /\d/,
      "Password must contain at least one number."
    );
  }

  if (requireSpecialCharacters) {
    passwordSchema = passwordSchema.regex(
      new RegExp(
        ALLOWED_SPECIAL_CHARACTERS.map((str) =>
          str.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&")
        ).join("|")
      ),
      "Password must contain at least one symbol."
    );
  }

  return baseSchema
    .extend({ password: passwordSchema })
    .refine((v) => v.password === v.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"], // path of error
    });
}

/**
 * TODO:
 * []-Handle use-case where sign in confirmation is outside app (e.g. Cognito send an email to user tha confirms their sign in).
 */
export const Route = createFileRoute("/(unauthenticated)/register")({
  component: RouteComponent,
  loader() {
    const config = Amplify.getConfig();
    const cliConfig = config.Auth?.Cognito;

    return {
      formSchema: buildSchema(cliConfig as PasswordSettings),
    };
  },
});

function RouteComponent() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}

function SignUpForm() {
  const { formSchema } = Route.useLoaderData();
  const form = useForm({
    defaultValues: {
      email: "mail@mail.com",
      password: "Password1!",
    },

    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate();

  const onSubmitHandler = form.handleSubmit(
    async (data) => {
      void navigate({
        to: "/confirm-account",
        search: {
          email: data.email,
        },
      });
      const result = await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
          },
        },
      }).catch((error) => {
        form.setError("root", { message: getErrorMessage(error) });

        return null;
      });

      if (!result) {
        return;
      }

      if (result.isSignUpComplete) {
        return void navigate({ to: "/home" });
      }

      switch (result.nextStep.signUpStep) {
        case "COMPLETE_AUTO_SIGN_IN": {
          // await autoSignIn();
          break;
        }
        case "CONFIRM_SIGN_UP": {
          void navigate({
            to: "/confirm-account",
            search: {
              email: data.email,
            },
          });
          break;
        }
        case "DONE": {
          void navigate({ to: "/home" });
          break;
        }
        default: {
          // TODO: Handle default case
          break;
        }
      }
    },
    (err) => {
      console.error(err);
    }
  );

  const rootError = form.formState.errors.root?.message;

  return (
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
      <Title>Sign up for an account</Title>
      {rootError !== undefined && (
        <Banner>
          <BannerContent>
            <Label>Register Error</Label>
            <Description>{rootError}</Description>
          </BannerContent>
        </Banner>
      )}
      <FieldGroup>
        <InputField
          control={form.control}
          field="email"
          label="Email Address"
        />
        <FieldControl control={form.control} field="password">
          <Label>Password</Label>
          <PasswordInput />
        </FieldControl>
        <FieldControl control={form.control} field="confirmPassword">
          <Label>Confirm Password</Label>
          <PasswordInput />
        </FieldControl>
      </FieldGroup>
      <Button
        type="submit"
        className="w-full"
        isPending={form.formState.isSubmitting}
      >
        Create Account
      </Button>
      <Text>
        Don’t have an account?{" "}
        <TextLink href="/login">
          <Strong>Sign In</Strong>
        </TextLink>
      </Text>
    </form>
  );
}
