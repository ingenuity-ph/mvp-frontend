import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox";
import { Field, Label } from "@/components/ui/fieldset";
import { PasswordInput, TextInput } from "@/components/ui/input";
import { Strong, Text, TextLink, Title } from "@/components/ui/text";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <AuthLayout>
      <form
        action="#"
        method="POST"
        className="grid w-full max-w-sm grid-cols-1 gap-8"
      >
        <Title>Sign in to your account</Title>
        <Field>
          <Label>Email</Label>
          <TextInput type="email" name="email" />
        </Field>
        <Field>
          <Label>Password</Label>
          <PasswordInput type="password" name="password" />
        </Field>
        <div className="flex items-center justify-between">
          <CheckboxField label="Remember me" />
          <Text>
            <TextLink href="#">
              <Strong>Forgot password?</Strong>
            </TextLink>
          </Text>
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Text>
          Don’t have an account?{" "}
          <TextLink href="#">
            <Strong>Sign up</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
}
