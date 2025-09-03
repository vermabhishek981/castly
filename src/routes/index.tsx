import { createFileRoute } from "@tanstack/react-router";
import { CharacterList } from "@/components/CharacterList";

export const Route = createFileRoute("/")({
  component: CharacterList,
});
