import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-edusport-blue">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Pagină negăsită
          </h2>
          <p className="text-gray-600 mb-8">
            Ne pare rău, pagina pe care o căutați nu există sau a fost mutată.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-edusport-blue text-white px-6 py-3 rounded-md hover:bg-edusport-blue/90 transition-colors"
          >
            Înapoi la pagina principală
          </Link>

          <div className="text-sm text-gray-500">
            <p>Sau încercați una din aceste pagini:</p>
            <div className="mt-2 space-x-4">
              <Link href="/about-us" className="text-edusport-blue hover:underline">
                Despre Noi
              </Link>
              <Link href="/courses" className="text-edusport-blue hover:underline">
                Cursuri
              </Link>
              <Link href="/contact" className="text-edusport-blue hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
