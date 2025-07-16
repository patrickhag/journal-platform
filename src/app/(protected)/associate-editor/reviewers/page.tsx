'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  UserPlus,
  Search,
  Mail,
  Building,
  GraduationCap,
  Calendar as CalendarIcon,
  Clock,
  FileText,
  User,
  Edit,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetReviewers } from '@/hooks/useUsers';

interface Reviewer {
  id: string;
  name: string;
  email: string;
  affiliation: string;
  expertise: string[];
  totalReviews: number;
}

interface ReviewAssignment {
  id: string;
  reviewerId: string;
  manuscriptId: string;
  manuscriptTitle: string;
  deadline: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  assignedAt: Date;
}

interface ManuscriptOption {
  id: string;
  title: string;
  status: string;
}

const ManageReviewers = () => {
  const [reviewers, setReviewers] = useState<Reviewer[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      affiliation: 'Stanford University',
      expertise: ['Machine Learning', 'Data Science', 'AI Ethics'],
      totalReviews: 15,
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      email: 'michael.chen@tech.edu',
      affiliation: 'MIT',
      expertise: ['Computer Vision', 'Deep Learning', 'Neural Networks'],
      totalReviews: 23,
    },
  ]);

  const [assignments, setAssignments] = useState<ReviewAssignment[]>([
    {
      id: '1',
      reviewerId: '1',
      manuscriptId: 'ms1',
      manuscriptTitle:
        'Deep Learning Approaches to Natural Language Processing',
      deadline: new Date('2024-02-15'),
      status: 'IN_PROGRESS',
      assignedAt: new Date('2024-01-20'),
    },
    {
      id: '2',
      reviewerId: '1',
      manuscriptId: 'ms1',
      manuscriptTitle:
        'Deep Learning Approaches to Natural Language Processing',
      deadline: new Date('2024-02-15'),
      status: 'IN_PROGRESS',
      assignedAt: new Date('2024-01-20'),
    },
    {
      id: '3',
      reviewerId: '1',
      manuscriptId: 'ms1',
      manuscriptTitle:
        'Deep Learning Approaches to Natural Language Processing',
      deadline: new Date('2024-02-15'),
      status: 'IN_PROGRESS',
      assignedAt: new Date('2024-01-20'),
    },
    {
      id: '4',
      reviewerId: '1',
      manuscriptId: 'ms1',
      manuscriptTitle:
        'Deep Learning Approaches to Natural Language Processing',
      deadline: new Date('2024-02-15'),
      status: 'IN_PROGRESS',
      assignedAt: new Date('2024-01-20'),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateReviewerOpen, setIsCreateReviewerOpen] = useState(false);
  const [isAssignReviewerOpen, setIsAssignReviewerOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState<Reviewer | null>(
    null
  );

  const { data: reviewerss } = useGetReviewers();

  console.log('reviewerss>>>', reviewerss);

  // Mock manuscripts for assignment
  const availableManuscripts: ManuscriptOption[] = [
    {
      id: 'ms1',
      title: 'Deep Learning Approaches to Natural Language Processing',
      status: 'UNDER_REVIEW',
    },
    {
      id: 'ms2',
      title: 'Quantum Computing Applications in Cryptography',
      status: 'UNDER_REVIEW',
    },
    {
      id: 'ms3',
      title: 'Sustainable AI Development Practices',
      status: 'UNDER_REVIEW',
    },
  ];

  // Form states
  const [reviewerForm, setReviewerForm] = useState({
    name: '',
    email: '',
    affiliation: '',
    expertise: '',
  });

  const [assignmentForm, setAssignmentForm] = useState({
    manuscriptId: '',
    deadline: undefined as Date | undefined,
  });

  const filteredReviewers = reviewers.filter(
    (reviewer) =>
      reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reviewer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reviewer.affiliation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reviewer.expertise.some((exp) =>
        exp.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleCreateReviewer = () => {
    if (
      !reviewerForm.name ||
      !reviewerForm.email ||
      !reviewerForm.affiliation ||
      !reviewerForm.expertise
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newReviewer: Reviewer = {
      id: Date.now().toString(),
      name: reviewerForm.name,
      email: reviewerForm.email,
      affiliation: reviewerForm.affiliation,
      expertise: reviewerForm.expertise.split(',').map((exp) => exp.trim()),
      totalReviews: 0,
    };

    setReviewers([...reviewers, newReviewer]);
    setReviewerForm({ name: '', email: '', affiliation: '', expertise: '' });
    setIsCreateReviewerOpen(false);

    toast.success('Reviewer account created successfully');
  };

  const handleAssignReviewer = () => {
    if (
      !selectedReviewer ||
      !assignmentForm.manuscriptId ||
      !assignmentForm.deadline
    ) {
      toast('Please fill in all required fields');
      return;
    }

    const manuscript = availableManuscripts.find(
      (m) => m.id === assignmentForm.manuscriptId
    );

    const newAssignment: ReviewAssignment = {
      id: Date.now().toString(),
      reviewerId: selectedReviewer.id,
      manuscriptId: assignmentForm.manuscriptId,
      manuscriptTitle: manuscript?.title || '',
      deadline: assignmentForm.deadline,
      status: 'PENDING',
      assignedAt: new Date(),
    };

    setAssignments([...assignments, newAssignment]);

    // Update reviewer's active reviews count
    // setReviewers(
    //   reviewers.map((reviewer) =>
    //     reviewer.id === selectedReviewer.id
    //       ? { ...reviewer, activeReviews: reviewer.activeReviews + 1 }
    //       : reviewer
    //   )
    // );

    setAssignmentForm({ manuscriptId: '', deadline: undefined });
    setSelectedReviewer(null);
    setIsAssignReviewerOpen(false);

    toast('Reviewer assigned successfully');
  };

  const getAssignmentsForReviewer = (reviewerId: string) => {
    return assignments.filter(
      (assignment) => assignment.reviewerId === reviewerId
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Reviewers</h1>
          <p className="text-gray-600">
            Create reviewer accounts, assign manuscripts, and track review
            progress
          </p>
        </div>

        <Sheet
          open={isCreateReviewerOpen}
          onOpenChange={setIsCreateReviewerOpen}
        >
          <SheetContent className="z-50 bg-white">
            <SheetHeader>
              <SheetTitle>Create New Reviewer Account</SheetTitle>
              <SheetDescription>
                Add a new reviewer to the system with their credentials and
                expertise
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={reviewerForm.name}
                  onChange={(e) =>
                    setReviewerForm({ ...reviewerForm, name: e.target.value })
                  }
                  placeholder="Dr. John Smith"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={reviewerForm.email}
                  onChange={(e) =>
                    setReviewerForm({ ...reviewerForm, email: e.target.value })
                  }
                  placeholder="john.smith@university.edu"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliation">Affiliation *</Label>
                <Input
                  id="affiliation"
                  value={reviewerForm.affiliation}
                  onChange={(e) =>
                    setReviewerForm({
                      ...reviewerForm,
                      affiliation: e.target.value,
                    })
                  }
                  placeholder="Harvard University"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expertise">Areas of Expertise *</Label>
                <Textarea
                  id="expertise"
                  value={reviewerForm.expertise}
                  onChange={(e) =>
                    setReviewerForm({
                      ...reviewerForm,
                      expertise: e.target.value,
                    })
                  }
                  placeholder="Machine Learning, Data Science, AI Ethics (comma-separated)"
                  rows={3}
                  className="bg-white"
                />
              </div>

              <Button onClick={handleCreateReviewer} className="w-full">
                Create Reviewer Account
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search and Stats */}
      <div className="flex justify-between">
        <div className="w-1/2 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reviewers by name, email, affiliation, or expertise..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateReviewerOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Reviewer
        </Button>
      </div>

      {/* Reviewers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reviewers ({filteredReviewers.length})</CardTitle>
          <CardDescription>
            Manage reviewer accounts and track their assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead>Affiliation</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Current Assignments</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviewers.map((reviewer) => {
                const reviewerAssignments = getAssignmentsForReviewer(
                  reviewer.id
                );

                return (
                  <TableRow key={reviewer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reviewer.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="mr-1 h-3 w-3" />
                          {reviewer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Building className="mr-2 h-4 w-4 text-gray-400" />
                        {reviewer.affiliation}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {reviewer.expertise.slice(0, 2).map((exp, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {exp}
                          </Badge>
                        ))}
                        {reviewer.expertise.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{reviewer.expertise.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center font-semibold">
                        {reviewer.totalReviews}
                      </div>
                    </TableCell>
                    <TableCell>
                      {reviewerAssignments.length > 0 ? (
                        <div className="space-y-1 max-w-xs">
                          {reviewerAssignments.slice(0, 2).map((assignment) => (
                            <div key={assignment.id} className="text-xs">
                              <div className="font-medium truncate">
                                {assignment.manuscriptTitle}
                              </div>
                              <div className="flex justify-between items-center">
                                <Badge
                                  className={cn(
                                    'text-xs',
                                    getStatusColor(assignment.status)
                                  )}
                                >
                                  {assignment.status.replace('_', ' ')}
                                </Badge>
                                <span className="text-gray-500">
                                  {format(assignment.deadline, 'MMM dd')}
                                </span>
                              </div>
                            </div>
                          ))}
                          {reviewerAssignments.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{reviewerAssignments.length - 2} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          No assignments
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Sheet
                          open={
                            isAssignReviewerOpen &&
                            selectedReviewer?.id === reviewer.id
                          }
                          onOpenChange={(open) => {
                            setIsAssignReviewerOpen(open);
                            if (open) setSelectedReviewer(reviewer);
                            else setSelectedReviewer(null);
                          }}
                        >
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="z-50 bg-white">
                            <SheetHeader>
                              <SheetTitle>
                                Assign Reviewer to Manuscript
                              </SheetTitle>
                              <SheetDescription>
                                Assign {reviewer.name} to review a specific
                                manuscript
                              </SheetDescription>
                            </SheetHeader>

                            <div className="space-y-4 mt-6">
                              <div className="space-y-2">
                                <Label>Reviewer</Label>
                                <div className="p-3 bg-gray-50 rounded">
                                  <div className="font-medium">
                                    {reviewer.name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {reviewer.email}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="manuscript">
                                  Select Manuscript *
                                </Label>
                                <Select
                                  value={assignmentForm.manuscriptId}
                                  onValueChange={(value) =>
                                    setAssignmentForm({
                                      ...assignmentForm,
                                      manuscriptId: value,
                                    })
                                  }
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Choose a manuscript" />
                                  </SelectTrigger>
                                  <SelectContent className="z-50 bg-white">
                                    {availableManuscripts.map((manuscript) => (
                                      <SelectItem
                                        key={manuscript.id}
                                        value={manuscript.id}
                                      >
                                        {manuscript.title}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Review Deadline *</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        'w-full justify-start text-left font-normal bg-white',
                                        !assignmentForm.deadline &&
                                          'text-muted-foreground'
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {assignmentForm.deadline ? (
                                        format(assignmentForm.deadline, 'PPP')
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0 z-50 bg-white"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={assignmentForm.deadline}
                                      onSelect={(date) =>
                                        setAssignmentForm({
                                          ...assignmentForm,
                                          deadline: date,
                                        })
                                      }
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                      className="p-3 pointer-events-auto"
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              <Button
                                onClick={handleAssignReviewer}
                                className="w-full"
                              >
                                Assign Reviewer
                              </Button>
                            </div>
                          </SheetContent>
                        </Sheet>

                        <Button variant="outline" size="sm">
                          <User className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredReviewers.length === 0 && (
            <div className="text-center py-8">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No reviewers found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first reviewer'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageReviewers;
