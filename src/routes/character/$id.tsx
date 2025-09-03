import { createFileRoute } from "@tanstack/react-router";
import { CharacterDetail } from "@/components/CharacterDetail";

export const Route = createFileRoute("/character/$id")({
  component: CharacterDetail,
});
