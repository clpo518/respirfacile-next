import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { MessageThread } from '@/components/therapist/MessageThread';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MessagesPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth');

  const { data: therapistProfile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  const isTherapist = therapistProfile?.role === 'therapist' || therapistProfile?.role === 'kine';
  if (!isTherapist) redirect('/dashboard');

  const { data: link } = await supabase
    .from('therapist_patients')
    .select('id')
    .eq('therapist_id', user.id)
    .eq('patient_id', id)
    .single();

  if (!link) notFound();

  const { data: patient } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', id)
    .single();

  if (!patient) notFound();

  // Charger les messages existants
  const { data: messages } = await supabase
    .from('messages')
    .select('id, content, sender_role, read_at, created_at')
    .eq('therapist_id', user.id)
    .eq('patient_id', id)
    .order('created_at', { ascending: true });

  const patientName = patient.full_name || patient.email || 'ce patient';

  return (
    <div className="min-h-screen bg-beige-200 flex flex-col">
      {/* Header */}
      <header className="bg-beige-100/95 backdrop-blur border-b border-beige-300 px-4 py-3 sticky top-0 z-40 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href={`/therapist/patients/${id}`}
            className="flex items-center gap-1.5 text-forest-500 hover:text-forest-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Retour</span>
          </Link>
          <div className="flex-1 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-forest-500/15 flex items-center justify-center text-sm font-bold text-forest-700">
              {patientName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-forest-800 text-sm leading-tight">{patientName}</p>
              <p className="text-xs text-forest-500 leading-tight">Messages · visible dans l'app patient</p>
            </div>
          </div>
        </div>
      </header>

      {/* Thread */}
      <div className="flex-1 max-w-2xl w-full mx-auto flex flex-col" style={{ height: 'calc(100vh - 65px)' }}>
        <MessageThread
          therapistId={user.id}
          patientId={id}
          patientName={patientName}
          initialMessages={messages || []}
        />
      </div>
    </div>
  );
}
