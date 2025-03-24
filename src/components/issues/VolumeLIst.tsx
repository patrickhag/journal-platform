import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VolumeType } from '@/lib/schemas';

interface VolumeLIstProps {
  volumes: ({ id: string } & VolumeType)[];
}

export function VolumeList({ volumes }: VolumeLIstProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {volumes.map((volume) => (
        <Card key={volume.id}>
          <CardHeader>
            <CardTitle>Volume {volume.volumeNumber}</CardTitle>
            <CardDescription>{volume.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Year: {volume.year}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  volume.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {volume.status}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
