import Button from "@/components/ui/Button";
import { SaveStatus } from "@/components/journal/NotebookPage";

// Smaller screens: a bar stuck to the bottom of the screen whenever the
// page has unsaved changes, so Save is always one tap away.
export default function SaveBar({
  status,
  onSave,
}: {
  status: SaveStatus;
  onSave: () => void;
}) {
  const visible =
    status === "unsaved" || status === "error" || status === "saving";
  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 flex items-center justify-between gap-3 rounded-full bg-paper px-5 py-2.5 shadow-[0_6px_20px_rgb(0_0_0/0.2)] lg:hidden">
      <span role="status" className="text-small text-ink">
        {status === "error" ? "Couldn't save, try again" : "Unsaved changes"}
      </span>
      <Button size="sm" onClick={onSave} disabled={status === "saving"}>
        {status === "saving" ? "Saving..." : "Save page"}
      </Button>
    </div>
  );
}
