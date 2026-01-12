import Header from '@/components/landingPage/header';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <Header />
      <main className="flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-indigo-600">404 Error</p>

          <h1 className="mt-3 text-3xl font-semibold text-gray-900 sm:text-4xl">
            Page not found
          </h1>

          <p className="mt-4 text-gray-600">
            Sorry, the page you’re looking for doesn’t exist or may have been
            moved. Please return to the Journal of African Epidemiology and
            Public Health homepage.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
