import { BookOpenCheck, BookText } from 'lucide-react';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Browse Issues
              </h2>
              <nav className="space-y-2">
                <a
                  href="#"
                  className="flex items-center text-blue-900 font-medium hover:text-blue-600 p-2 rounded"
                >
                  <BookOpenCheck className="h-5 w-5 mr-2" />
                  Latest Articles
                </a>
                <a
                  href="#"
                  className="flex items-center text-blue-900 font-medium hover:text-blue-600 p-2 rounded"
                >
                  <BookText className="h-5 w-5 mr-2" />
                  Current Issue
                </a>
              </nav>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
