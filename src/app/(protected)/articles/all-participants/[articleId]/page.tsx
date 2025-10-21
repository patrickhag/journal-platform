'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Eye, Edit3, Shield } from 'lucide-react';
import { useGetParticipants } from '@/hooks/useUsers';
import { useParams } from 'next/navigation';
import { TParticipants } from '@/types';
import ParticipantsLoader from '@/components/ParticipantsLoader';
import Link from 'next/link';

// Types for display components
interface DisplayParticipant {
  id: string;
  name: string;
  role: 'staff_editor' | 'reviewer' | 'associate_editor';
  expertise: string | null;
}

// Helper function to transform API data to display format
const transformParticipantsData = (
  apiData: TParticipants
): DisplayParticipant[] => {
  const participants: DisplayParticipant[] = [];

  // Add staff editor
  if (apiData.staffEditor) {
    const staffEditor = apiData.staffEditor;
    participants.push({
      id: 'staff-editor',
      name: `${staffEditor.prefix ? staffEditor.prefix + ' ' : ''}${staffEditor.firstName} ${staffEditor.lastName}`.trim(),
      role: 'staff_editor',
      expertise: staffEditor.expertise,
    });
  }

  // Add associate editors
  apiData.associateEditors?.forEach((editor) => {
    participants.push({
      id: editor.id,
      name: `${editor.user.prefix ? editor.user.prefix + ' ' : ''}${editor.user.firstName} ${editor.user.lastName}`.trim(),
      role: 'associate_editor',
      expertise: editor.user.expertise,
    });
  });

  // Add reviewers
  apiData.reviewers?.forEach((reviewer) => {
    participants.push({
      id: reviewer.id,
      name: `${reviewer.user.prefix ? reviewer.user.prefix + ' ' : ''}${reviewer.user.firstName} ${reviewer.user.lastName}`.trim(),
      role: 'reviewer',
      expertise: reviewer.user.expertise,
    });
  });

  return participants;
};

// Helper functions
const getRoleIcon = (role: string) => {
  switch (role) {
    case 'reviewer':
      return Eye;
    case 'associate_editor':
      return Edit3;
    case 'staff_editor':
      return Shield;
    default:
      return User;
  }
};

const ParticipantCard = ({
  participant,
}: {
  participant: DisplayParticipant;
}) => {
  const initials = participant.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getRoleBackgroundColor = (role: string) => {
    switch (role) {
      case 'reviewer':
        return 'bg-purple-50';
      case 'associate_editor':
        return 'bg-blue-50';
      case 'staff_editor':
        return 'bg-gray-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <Avatar className="w-12 h-12">
        <AvatarFallback className="bg-gray-200 text-gray-700">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">{participant.name}</h4>
        </div>

        {/* Role-specific information */}
        {participant.expertise && (
          <div
            className={`mt-3 p-3 ${getRoleBackgroundColor(participant.role)} rounded-md`}
          >
            <div className="text-sm">
              <p>
                <strong>Expertise:</strong> {participant.expertise}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AllParticipants = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const {
    data: apiParticipants,
    isLoading,
    error,
  } = useGetParticipants(articleId);

  // Transform and group participants by role
  const participants = apiParticipants
    ? transformParticipantsData(apiParticipants)
    : [];

  const groupedParticipants = participants.reduce(
    (acc, participant) => {
      if (!acc[participant.role]) {
        acc[participant.role] = [];
      }
      acc[participant.role].push(participant);
      return acc;
    },
    {} as Record<string, DisplayParticipant[]>
  );

  const roleOrder = ['staff_editor', 'associate_editor', 'reviewer'];
  const roleLabels = {
    staff_editor: 'Staff Editors',
    associate_editor: 'Associate Editors',
    reviewer: 'Reviewers',
  };

  if (isLoading) {
    return <ParticipantsLoader />;
  }

  if (error) {
    return (
      <Card className="my-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-sm text-red-500">
              Error loading participants
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#1a237e] flex items-center">
          <User className="w-5 h-5 mr-2" />
          All Participants
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Everyone involved in the peer-review process for this manuscript
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {roleOrder.map((role, index) => {
            const roleParticipants = groupedParticipants[role];
            if (!roleParticipants || roleParticipants.length === 0) return null;

            return (
              <div key={role}>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  {React.createElement(getRoleIcon(role), {
                    className: 'w-5 h-5 mr-2',
                  })}
                  {roleLabels[role as keyof typeof roleLabels]} (
                  {roleParticipants.length})
                </h3>
                <div className="space-y-3">
                  {roleParticipants.map((participant) => (
                    <ParticipantCard
                      key={participant.id}
                      participant={participant}
                    />
                  ))}
                </div>
                {index < roleOrder.length - 1 && <Separator className="mt-6" />}
              </div>
            );
          })}
        </div>

        {participants.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              No participants assigned to this article
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AllParticipants;
