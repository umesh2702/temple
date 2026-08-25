'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';

export default function LegacyTempleRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      router.replace(`/temples/${id}`);
    }
  }, [id, router]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
      <Compass className="w-12 h-12 text-amber-600 animate-spin mx-auto" />
      <h2 className="font-serif font-bold text-2xl text-stone-800 dark:text-amber-100">
        Redirecting to Sacred Temple Journey...
      </h2>
    </div>
  );
}
