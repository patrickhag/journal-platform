import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Settings,
  FileText,
  Shield,
  FileQuestion,
  BookMarked,
  Goal,
  ShieldAlert,
} from 'lucide-react';
import EditorsPick from '../components/EditorsPick';
import Guidelines from '../components/Guidelines';
import AboutUs from '../components/AboutUs';
import Policies from '../components/Policies';
import AimsNScope from '../components/AimsNScope';
import TermsAndConditions from '../components/TermsNConditions';

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
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Journal Settings</CardTitle>
                <CardDescription>
                  Configure general journal settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Journal Name</label>
                  <Input defaultValue="Journal of Scientific Research" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea defaultValue="A peer-reviewed journal publishing original research..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input type="email" defaultValue="editor@journal.com" />
                </div>
                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ManagePage;
