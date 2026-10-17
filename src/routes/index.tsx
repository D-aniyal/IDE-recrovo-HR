import { createFileRoute } from "@tanstack/react-router";
import { ProctoringCockpit } from "@/components/ProctoringCockpit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Recrovo IDE — Live Interview" },
      {
        name: "description",
        content: "A live coding interview workspace for secure evaluation and interviewer review.",
      },
      { property: "og:title", content: "Recrovo IDE — Live Interview" },
      {
        property: "og:description",
        content: "A live coding interview workspace for secure evaluation and interviewer review.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <ProctoringCockpit />;
}
