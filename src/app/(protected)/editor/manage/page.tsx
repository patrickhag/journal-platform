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
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Site settings</h1>
          <p className="mt-2 text-gray-600">
            Manage featured articles, submission guidelines, author
            instructions, journal policies, and general settings.
          </p>
        </div>
        <Tabs defaultValue="editor-picks" className="space-y-6">
          <TabsList className="bg-white p-1 gap-2">
            <TabsTrigger
              value="editor-picks"
              className="flex items-center gap-2"
            >
              <BookMarked className="h-4 w-4" />
              Editor&apos;s Picks
            </TabsTrigger>
            <TabsTrigger value="guidelines" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Guidelines
            </TabsTrigger>
            <TabsTrigger value="aboutUs" className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4" />
              About us
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="aimsNscope" className="flex items-center gap-2">
              <Goal className="h-4 w-4" />
              Aims & Scope
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <Files className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Supporters
            </TabsTrigger>
            <TabsTrigger
              value="termsNconditions"
              className="flex items-center gap-2"
            >
              <ShieldAlert className="h-4 w-4" />
              Terms and conditions
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          {/* Tab Components */}
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
