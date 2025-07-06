'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Users, Clock, UserCheck, AlertCircle } from 'lucide-react';
import AssignEditorModal from './[articleId]/components/AssignAssociateEditorModal';

const ChiefEditorDashboard = () => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedManuscript, setSelectedManuscript] = useState(null);

  // Mock data for submitted manuscripts awaiting editor assignment
  const submittedManuscripts = [
    {
      id: 'MS-2024-001',
      title: 'Advanced Machine Learning Techniques in Medical Diagnosis',
      author: 'Dr. Sarah Johnson',
      submittedDate: '2024-01-15',
      status: 'Submitted',
      specialty: 'Computer Science',
    },
    {
      id: 'MS-2024-002',
      title: 'Climate Change Impact on Coastal Ecosystems',
      author: 'Dr. Michael Chen',
      submittedDate: '2024-01-14',
      status: 'Submitted',
      specialty: 'Environmental Science',
    },
    {
      id: 'MS-2024-003',
      title: 'Novel Approaches to Quantum Computing',
      author: 'Dr. Emma Rodriguez',
      submittedDate: '2024-01-13',
      status: 'Submitted',
      specialty: 'Physics',
    },
  ];

  // Mock data for available editors
  const availableEditors = [
    {
      id: 'ED-001',
      name: 'Dr. Robert Smith',
      specialty: 'Computer Science',
      workload: 3,
    },
    {
      id: 'ED-002',
      name: 'Dr. Lisa Wang',
      specialty: 'Environmental Science',
      workload: 2,
    },
    {
      id: 'ED-003',
      name: 'Dr. James Wilson',
      specialty: 'Physics',
      workload: 4,
    },
    {
      id: 'ED-004',
      name: 'Dr. Maria Garcia',
      specialty: 'Computer Science',
      workload: 1,
    },
  ];

  const handleAssignEditor = (manuscriptId: string, editorId: string) => {
    const editor = availableEditors.find((e) => e.id === editorId);
    const manuscript = submittedManuscripts.find((m) => m.id === manuscriptId);

    console.log(
      `Assigning editor ${editor?.name} to manuscript ${manuscript?.title}`
    );
    // This would typically update the backend
    // You could also show a toast notification here
  };

  const openAssignModal = (manuscript: any) => {
    setSelectedManuscript(manuscript);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Assignments
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Manuscripts awaiting editor assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Editors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Editors currently handling manuscripts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Submissions
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Assignment Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3</div>
            <p className="text-xs text-muted-foreground">
              Days to assign editor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Manuscripts Awaiting Editor Assignment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Manuscripts Awaiting Editor Assignment
          </CardTitle>
          <CardDescription>
            Submitted manuscripts that need an editor assigned to manage the
            review process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submittedManuscripts.map((manuscript) => (
              <div
                key={manuscript.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{manuscript.title}</h3>
                      <Badge variant="outline">{manuscript.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Author:</strong> {manuscript.author}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Submitted:</strong> {manuscript.submittedDate}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Specialty:</strong> {manuscript.specialty}
                    </p>
                  </div>
                </div>

                {/* Quick Assignment Section */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      <span className="font-medium">Assign Editor</span>
                      <span className="text-sm text-gray-500">
                        (
                        {
                          availableEditors.filter(
                            (editor) =>
                              editor.specialty === manuscript.specialty
                          ).length
                        }{' '}
                        available)
                      </span>
                    </div>
                    <Button onClick={() => openAssignModal(manuscript)}>
                      Assign
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assignment Modal */}
      <AssignEditorModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
      />
    </div>
  );
};

export default ChiefEditorDashboard;
