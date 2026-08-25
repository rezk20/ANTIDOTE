import {
  getNotes,
  getNoteFoldersWithCounts,
  getNoteTagsWithCounts,
} from "@/lib/dal/notes";
import { NotesView } from "@/components/notes/notes-view";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const [notes, folderCounts, tags] = await Promise.all([
    getNotes(),
    getNoteFoldersWithCounts(),
    getNoteTagsWithCounts(),
  ]);

  return (
    <NotesView
      notes={notes}
      folderCounts={folderCounts}
      tags={tags}
    />
  );
}
