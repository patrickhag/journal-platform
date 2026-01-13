import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  FileText,
  Shield,
  FileQuestion,
  BookMarked,
  Goal,
  ShieldAlert,
  Files,
  Globe,
} from 'lucide-react';
import EditorsPick from './components/EditorsPick';
import Guidelines from './components/Guidelines';
import AboutUs from './components/AboutUs';
import Policies from './components/Policies';
import AimsNScope from './components/AimsNScope';
import TermsAndConditions from './components/TermsNConditions';
import SiteSettings from './components/Settings';
import Documents from './components/Documents';
import Supporters from './components/Supporters';

function ManagePage() {
  const tabConfig = [
    {
      value: 'editor-picks',
      label: "Editor's Picks",
      icon: BookMarked,
    },
    {
      value: 'guidelines',
      label: 'Guidelines',
      icon: FileText,
    },
    {
      value: 'aboutUs',
      label: 'About us',
      icon: FileQuestion,
    },
    {
      value: 'policies',
      label: 'Policies',
      icon: Shield,
    },
    {
      value: 'aimsNscope',
      label: 'Aims & Scope',
      icon: Goal,
    },
    {
      value: 'documents',
      label: 'Documents',
      icon: Files,
    },
    {
      value: 'supporters',
      label: 'Supporters',
      icon: Globe,
    },
    {
      value: 'termsNconditions',
      label: 'Terms and conditions',
      icon: ShieldAlert,
    },
    {
      value: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Site settings</h1>
          <p className="mt-2 text-gray-600">
            Manage featured articles, submission guidelines, author
            instructions, journal policies, and general settings and many more.
          </p>
        </div>
        <Tabs defaultValue="editor-picks" className="space-y-6">
          <div className="relative rounded-sm overflow-auto h-10 bg-muted custom-scrollbar">
            <TabsList className="absolute flex flex-row justify-stretch w-full bg-white p-1 gap-2">
              {tabConfig.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value} className="w-full">
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <EditorsPick />
          <Guidelines />
          <AboutUs />
          <Policies />
          <TermsAndConditions />
          <AimsNScope />
          <Documents />
          <Supporters />
          <SiteSettings />
        </Tabs>
      </div>
    </div>
  );
}

export default ManagePage;
