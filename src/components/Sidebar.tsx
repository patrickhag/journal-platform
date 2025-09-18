'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Calendar,
  CheckSquare,
  ClipboardCheck,
  Clock,
  FileCog,
  Files,
  FileText,
  Mail,
  MessageSquare,
  MonitorSpeaker,
  Newspaper,
  PlusCircle,
  ShieldUser,
  Users,
} from 'lucide-react';

interface SidebarProps {
  userRole: string;
}

const Sidebar = ({ userRole }: SidebarProps) => {
  const pathname = usePathname();

  const getMenuItems = () => {
    switch (userRole) {
      case 'normal_user':
        return [
          { href: '/submissions', label: 'My Submissions', icon: FileText },
          {
            href: '/articles/new/start',
            label: 'New Submission',
            icon: PlusCircle,
          },
          { href: '/reviews', label: 'Reviews Received', icon: MessageSquare },
        ];
      case 'chief_editor':
        return [
          { href: '/editor/dashboard', label: 'Overview', icon: BarChart3 },
          {
            href: '/editor/articles',
            label: 'Manage Submissions',
            icon: FileText,
          },
          { href: '/editor/users', label: 'Manage Users', icon: Users },
          {
            href: '/editor/manage-editors',
            label: 'Manage Editors',
            icon: ShieldUser,
          },
          {
            href: '/editor/collections',
            label: 'Manage Collections',
            icon: Files,
          },
          {
            href: '/editor/issues',
            label: 'Manage Issues',
            icon: Calendar,
          },
          {
            href: '/editor/manage-ads',
            label: 'Manage Ads',
            icon: MonitorSpeaker,
          },
          {
            href: '/editor/manage',
            label: 'Site Settings',
            icon: FileCog,
          },
          {
            href: '/editor/published',
            label: 'Published Manuscripts',
            icon: ClipboardCheck,
          },
          {
            href: '/editor/inquiries',
            label: 'Manage Inquiries',
            icon: Mail,
          },
        ];
      case 'reviewer':
        return [
          {
            href: '/reviewer/assignments',
            label: 'My Assignments',
            icon: Files,
          },
          {
            href: '/reviewer/deadlines',
            label: 'Upcoming Deadlines',
            icon: Clock,
          },
          {
            href: '/reviewer/revisions',
            label: 'Sent Reviews',
            icon: FileText,
          },
          {
            href: '/reviewer/finalised',
            label: 'Finalised Assignments',
            icon: CheckSquare,
          },
        ];
      case 'associate_editor':
        return [
          {
            href: '/associate-editor/assignments',
            label: 'Assignments',
            icon: CheckSquare,
          },
          {
            href: '/associate-editor/collections',
            label: 'Sent Assignments',
            icon: FileText,
          },
        ];
      case 'staff_editor':
        return [
          {
            href: '/staff-editor/assigned',
            label: 'Assigned to me',
            icon: CheckSquare,
          },
          {
            href: '/staff-editor/reviewers',
            label: 'Manage Reviewers',
            icon: Users,
          },
          {
            href: '/staff-editor/publish',
            label: 'Publish Manuscript',
            icon: Newspaper,
          },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="h-full bg-gray-50 border-r p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
