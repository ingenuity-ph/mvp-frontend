import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Button href="/logout">Logout</Button>
    </div>
  );
}
