import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Mail, User } from 'lucide-react';
import Header from '@/components/landingPage/header';
import Footer from '@/components/landingPage/footer';
import { db } from '@/db/db';
import { eq, or } from 'drizzle-orm';
import { users } from '@/db/schema';
import LeftSideBar from '@/components/landingPage/leftSideBar';

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'CHIEF_EDITOR':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'ASSOCIATE_EDITOR':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default async function EditorialBoardPage() {
  const foundEditors = await db.query.users.findMany({
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
      country: true,
      orcid: true,
      avatar: true,
      bio: true,
      affiliation: true,
    },
    where: or(
      eq(users.role, 'CHIEF_EDITOR'),
      eq(users.role, 'ASSOCIATE_EDITOR')
    ),
  });

  const foundReviewers = await db.query.users.findMany({
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      bio: true,
      affiliation: true,
    },
    where: eq(users.role, 'REVIEWER'),
  });

  // Separate members by role
  const editorInChief = foundEditors.filter(
    (member) => member.role === 'CHIEF_EDITOR'
  );
  const otherMembers = foundEditors.filter(
    (member) => member.role !== 'CHIEF_EDITOR'
  );

  const MemberCard = ({ member }: { member: (typeof foundEditors)[0] }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.firstName + ' ' + member.lastName}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {member.firstName + ' ' + member.lastName}
              </h3>
              <Badge
                className={`ml-2 text-xs ${getRoleBadgeColor(member.role)} hover:bg-transparent`}
              >
                {member.role}
              </Badge>
            </div>

            <p className="text-sm text-gray-600 mb-2">{member.affiliation}</p>

            <p className="text-sm text-gray-500 mb-3">{member.country}</p>

            {/* {member.areasOfExpertise && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Areas of Expertise:
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {member.areasOfExpertise}
                </p>
              </div>
            )} */}

            {member.bio && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Biography:
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            )}

            {member.orcid && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ReviewerCard = ({
    reviewer,
  }: {
    reviewer: (typeof foundReviewers)[0];
  }) => (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {`${reviewer.firstName} ${reviewer.lastName}`}
            </h4>
            <p className="text-xs text-gray-600 mb-1 truncate">
              {reviewer.affiliation}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              {reviewer.bio}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-9">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Editorial Board
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our distinguished editorial board consists of leading experts in
                epidemiology, public health, and related fields from across
                Africa and beyond. They bring extensive experience in research,
                education, and policy to ensure the highest standards of
                scientific rigor and editorial excellence.
              </p>
            </div>

            {/* Editor-in-Chief Section */}
            {editorInChief.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Editor-in-Chief
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {editorInChief.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            )}

            {/* Separator */}
            {editorInChief.length > 0 && otherMembers.length > 0 && (
              <div className="my-8">
                <Separator className="bg-gray-200" />
              </div>
            )}

            {/* Other Editorial Board Members */}
            {otherMembers.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Editorial Board Members
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherMembers.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            )}
            {/* Separator before Reviewers */}
            <div className="my-8">
              <Separator className="bg-gray-200" />
            </div>

            {/* Reviewers Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Reviewers
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our peer review process is supported by a dedicated network of
                expert reviewers who contribute their specialized knowledge to
                maintain the journal&apos;s high standards of scientific
                excellence.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {foundReviewers.map((reviewer) => (
                  <ReviewerCard key={reviewer.id} reviewer={reviewer} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <LeftSideBar />
        </div>
        <Footer />
      </div>
    </div>
  );
}
