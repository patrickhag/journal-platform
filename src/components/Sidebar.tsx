'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Calendar,
  CheckCircle,
  CheckSquare,
  ClipboardCheck,
  Clock,
  FileCog,
  Files,
  FileText,
  Hourglass,
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
          {
            href: '/author/submissions',
            label: 'My Submissions',
            icon: FileText,
          },
          {
            href: '/author/new/start',
            label: 'New Submission',
            icon: PlusCircle,
          },
          {
            href: '/author/under-review',
            label: 'Under Review',
            icon: Hourglass,
          },
          { href: '/author/reviews', label: 'Correction', icon: MessageSquare },
          {
            href: '/author/under-press',
            label: 'Under Press',
            icon: Newspaper,
          },
          { href: '/author/published', label: 'Published', icon: CheckCircle },
        ];
      case 'chief_editor':
        return [
          { href: '/editor/dashboard', label: 'Overview', icon: BarChart3 },
          {
            href: '/editor/manage-submissions',
            label: 'Manage Submissions',
            icon: FileText,
          },
          {
            href: '/editor/manage-under-reviews',
            label: 'Manage Under Reviews',
            icon: Hourglass,
          },
          {
            href: '/editor/manage-corrections',
            label: 'Manage Corrections',
            icon: MessageSquare,
          },
          {
            href: '/editor/manage-under-press',
            label: 'Manage Under Press',
            icon: Newspaper,
          },
          {
            href: '/editor/approve-publish',
            label: 'Approve & Publish',
            icon: ClipboardCheck,
          },
          {
            href: '/editor/manage-published',
            label: 'Manage Published',
            icon: CheckCircle,
          },
          { href: '/editor/users', label: 'Manage Users', icon: Users },
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
            href: '/reviewer/finalized',
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
            href: '/associate-editor/finalized',
            label: 'Finalised Assignments',
            icon: FileText,
          },
        ];
      case 'staff_editor':
        return [
          {
            href: '/staff-editor/assignments',
            label: 'Assignments',
            icon: CheckSquare,
          },
          {
            href: '/staff-editor/under-review',
            label: 'Under Review',
            icon: Hourglass,
          },
          {
            href: '/staff-editor/corrections',
            label: 'Corrections',
            icon: MessageSquare,
          },
          {
            href: '/staff-editor/under-press',
            label: 'Under Press',
            icon: Newspaper,
          },
          {
            href: '/staff-editor/reviewers',
            label: 'Manage Reviewers',
            icon: Users,
          },
          {
            href: '/staff-editor/manage-editors',
            label: 'Manage Associate Editors',
            icon: ShieldUser,
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
