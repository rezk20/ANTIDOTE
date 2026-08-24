import { redirect } from "next/navigation";
import { getSession } from "@/lib/dal/auth";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  const session = await getSession();

  if (session?.isAuth) {
    redirect("/home");
  }

  redirect("/login");
}
