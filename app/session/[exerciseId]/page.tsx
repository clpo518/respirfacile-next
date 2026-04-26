import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getExerciseById } from "@/lib/data/exercises";
import SessionClient from "./SessionClient";

interface PageProps {
  params: Promise<{ exerciseId: string }>;
}

export default async function SessionPage({ params }: PageProps) {
  const { exerciseId } = await params;

  const exercise = getExerciseById(exerciseId);
  if (!exercise) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  const isTherapist =
    profile?.role === "therapist" || profile?.role === "kine";
  if (isTherapist) redirect("/therapist");

  return <SessionClient exercise={exercise} userId={user.id} />;
}
