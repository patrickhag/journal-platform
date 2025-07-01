import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function SiteSettings() {
  return (
    <div>
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
    </div>
  );
}
