'use client';

import {Link} from '@/i18n/routing';

export default function Custom404() {
  return (
    <main className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-9xl font-heading font-black text-primary/20 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">404</h1>
        <div className="relative z-10">
          <h2 className="text-4xl font-heading font-bold mb-6">Faqja nuk u gjend</h2>
          <p className="text-gray-400 mb-10 max-w-md mx-auto">
            Më vjen keq, por faqja që po kërkoni nuk ekziston ose është zhvendosur. Ju lutem kthehuni në faqen kryesore.
          </p>
          <Link href="/" className="btn-primary">
            Kthehu në Fillim
          </Link>
        </div>
      </div>
    </main>
  );
}
