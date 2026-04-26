import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

// Cette route redirige vers la page de détail patient canonique
export default async function TherapistPatientRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/patient/${id}`);
}
