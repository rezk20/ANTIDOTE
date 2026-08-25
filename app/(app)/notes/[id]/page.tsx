import { notFound } from "next/navigation";
import { getNoteById } from "@/lib/dal/notes";
import { NoteEditorPage } from "@/components/notes/note-editor-page";

export const dynamic = "force-dynamic";

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return <NoteEditorPage isNew={true} />;
  }

  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  return <NoteEditorPage initialNote={note} isNew={false} />;
}
