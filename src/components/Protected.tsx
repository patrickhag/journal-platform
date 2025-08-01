import { auth } from '@/auth';
import { USER_ROLE } from '@/lib/roles';
import Link from 'next/link';
import { ReactNode } from 'react';
interface ProtectedProps {
  allowedRoles: string[];
  children: ReactNode;
}

const ROLE_ROUTES: Record<USER_ROLE, string> = {
  NORMAL_USER: '/submissions',
  REVIEWER: '/reviewer',
  CHIEF_EDITOR: '/editor/dashboard',
  ADMIN: '/editor',
  ASSOCIATE_EDITOR: '/associate-editor/assigned',
} as const;

function getRedirectRoute(role: USER_ROLE): string {
  return ROLE_ROUTES[role] || '/';
}

function getRoleDisplayName(role: USER_ROLE): string {
  const roleNames: Record<USER_ROLE, string> = {
    NORMAL_USER: 'Author',
    REVIEWER: 'Reviewer',
    CHIEF_EDITOR: 'Chief Editor',
    ASSOCIATE_EDITOR: 'Associate Editor',
    ADMIN: 'Administrator',
  };
  return roleNames[role] || 'Author';
}

export default async function Protected({
  allowedRoles,
  children,
}: ProtectedProps) {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="grid place-items-center h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-red-600">401</h1>
            <div className="border-r-2 border-gray-300 mx-4 h-8"></div>
            <p className="text-lg">Authentication Required</p>
          </div>
          <p className="text-gray-600">
            You need to be logged in to access this page.
          </p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const role = session.user.role as USER_ROLE;

  if (!allowedRoles.includes(role)) {
    const redirectRoute = getRedirectRoute(role);
    const roleDisplayName = getRoleDisplayName(role);

    return (
      <div className="grid place-items-center h-[calc(100vh-4rem)]">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-red-600">403</h1>
            <div className="border-r-2 border-gray-300 mx-4 h-8"></div>
            <p className="text-lg">Access Forbidden</p>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600">
              You don&apos;t have permission to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Your current role:{' '}
              <span className="font-medium">{roleDisplayName}</span>
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href={redirectRoute}
              className="inline-block bg-[#212c9e] text-white px-6 py-3 rounded-lg hover:bg-[#1A237E] transition-colors font-medium"
            >
              Go to Your Dashboard
            </Link>

            <div className="text-sm">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
