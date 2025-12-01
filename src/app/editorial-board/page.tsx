import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, MapPin, GraduationCap } from 'lucide-react';
import Header from '@/components/landingPage/header';
import Footer from '@/components/landingPage/footer';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { userRoles, users } from '@/db/schema';
import LeftSideBar from '@/components/landingPage/leftSideBar';
import { roleMap } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type EditorialBoardMember = {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    prefix: string | null;
    avatar: string | null;
    email: string | null;
    affiliation: string | null;
    country: string | null;
    bio: string | null;
    orcid: string | null;
    expertise: string | null;
  };
  user_roles: {
    role: string;
  };
};

export default async function EditorialBoardPage() {
  // Fetch all users who are part of the editorial board
  const allMembers = await db
    .select()
    .from(userRoles)
    .innerJoin(users, eq(userRoles.userId, users.id))
    .where(eq(users.isPartOfEditorialBoard, true));

  console.log('allMembers:', allMembers);

  // Group members by role
  const groupedByRole = allMembers.reduce(
    (acc, member) => {
      const role = member.user_roles.role;
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(member as EditorialBoardMember);
      return acc;
    },
    {} as Record<string, EditorialBoardMember[]>
  );

  // Define role display order and hierarchy
  const roleOrder = [
    'CHIEF_EDITOR',
    'SENIOR_EDITOR',
    'LEAD_EDITOR',
    'ASSOCIATE_EDITOR',
    'ASSISTANT_EDITOR',
    'EDITORIAL_BOARD_MEMBER',
    'EDITORIAL_ADVISOR',
    'REVIEWER',
  ];

  // Roles that should NOT show pictures
  const rolesWithoutPictures = ['REVIEWER', 'AUTHOR'];
  const inlineProfileRoles = new Set([
    'EDITORIAL_BOARD_MEMBER',
    'ASSOCIATE_EDITOR',
    'ASSISTANT_EDITOR',
    'EDITORIAL_ADVISOR',
  ]);

  const toTitleCase = (value: string) =>
    value
      .toLowerCase()
      .split(/[_\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const pluralize = (label: string) => {
    if (label.endsWith('s')) return label;
    if (label.endsWith('y')) {
      return `${label.slice(0, -1)}ies`;
    }
    return `${label}s`;
  };

  const formatRoleLabel = (role: string) => {
    const baseLabel = roleMap[role] || toTitleCase(role);
    return pluralize(baseLabel);
  };

  const MemberCard = ({
    member,
    isEditorialBoardMember = false,
  }: {
    member: EditorialBoardMember;
    isEditorialBoardMember?: boolean;
  }) => {
    const roleKey = member.user_roles.role;
    const fullName = `${member.user.prefix ? `${member.user.prefix}. ` : ''}${
      member.user.firstName || ''
    } ${member.user.lastName || ''}`.trim();
    const firstName = member.user.firstName || '';
    const initial = firstName.charAt(0).toUpperCase() || 'U';
    const showPicture = !rolesWithoutPictures.includes(roleKey);
    const shouldUseInlineProfile = inlineProfileRoles.has(roleKey);

    if (shouldUseInlineProfile) {
      const inlineName =
        `${member.user.firstName || ''} ${member.user.lastName || ''}`.trim() ||
        fullName ||
        'Name not specified';
      const profileSegments = [
        inlineName,
        member.user.prefix || '',
        member.user.affiliation || '',
        member.user.country || '',
      ].filter((segment) => segment && segment.length > 0);

      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-gray-900 flex-1">
              {profileSegments.join(', ')}
            </p>
            {member.user.orcid && (
              <div className="flex-shrink-0">
                <Button variant="outline" size="sm" className="text-xs" asChild>
                  <a
                    href={`https://orcid.org/${member.user.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    ORCID
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (isEditorialBoardMember) {
      return (
        <div className="border rounded-lg">
          <div className="p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 border rounded-full flex items-center justify-center">
                  <span className="font-semibold text-sm">{initial}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold mb-1">
                  {fullName || 'Name not specified'}
                </h3>
                {member.user.affiliation && (
                  <p className="text-xs mb-1 truncate">
                    {member.user.affiliation}
                  </p>
                )}
                {member.user.bio && (
                  <p className="text-xs leading-relaxed line-clamp-2">
                    {member.user.bio}
                  </p>
                )}
                {member.user.orcid && (
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      asChild
                    >
                      <a
                        href={`https://orcid.org/${member.user.orcid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        ORCID Profile
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full rounded-lg border border-gray-200">
        <div className="p-3">
          <div className="flex items-start space-x-4">
            {showPicture ? (
              <div className="flex-shrink-0">
                {member.user.avatar ? (
                  <Avatar className="w-20 h-20 border-2 border-gray-200">
                    <AvatarImage
                      src={member.user.avatar}
                      alt={fullName}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-sky-500 to-indigo-500 text-white text-lg font-semibold">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="w-20 h-20 border border-gray-200">
                    <AvatarFallback className="bg-gradient-to-br from-sky-500 to-indigo-500 text-white text-lg font-semibold">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {initial}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {fullName || 'Name not specified'}
              </h3>

              {member.user.affiliation && (
                <div className="flex items-start gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">
                    {member.user.affiliation}
                  </p>
                </div>
              )}

              {member.user.country && (
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                  <p className="text-sm text-gray-500">{member.user.country}</p>
                </div>
              )}

              {member.user.expertise && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Expertise:
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {member.user.expertise}
                  </p>
                </div>
              )}

              {member.user.bio && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Biography:
                  </p>
                  <p className="text-xs text-gray-900 leading-relaxed line-clamp-3">
                    {member.user.bio}
                  </p>
                </div>
              )}

              {member.user.orcid && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    asChild
                  >
                    <a
                      href={`https://orcid.org/${member.user.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      ORCID Profile
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="px-4 md:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8 px-4 py-6 mb-9">
          {/* Main Content */}
          <div className="lg:w-3/4">
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
              <p className="text-gray-600 leading-relaxed mt-3">
                To contact members of the team please send an email to{' '}
                <a
                  href="mailto:info@airpd.org"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  info@airpd.org
                </a>
                .
              </p>
            </div>

            {/* Render each role group */}
            {roleOrder.map((role: string, roleIndex: number) => {
              const members: EditorialBoardMember[] = groupedByRole[role] || [];
              if (members.length === 0) return null;

              const roleLabel =
                role === 'REVIEWER' ? 'Reviewers' : formatRoleLabel(role);

              const isEditorialBoardMember = role === 'REVIEWER';

              return (
                <div key={role}>
                  {roleIndex > 0 && (
                    <div className="my-8">
                      <Separator className="bg-gray-200" />
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      {roleLabel}
                    </h3>
                    <div
                      className={
                        isEditorialBoardMember
                          ? 'grid md:grid-cols-2 gap-4'
                          : 'grid grid-cols-1 md:grid-cols-1 gap-6'
                      }
                    >
                      {members.map((member: EditorialBoardMember) => (
                        <MemberCard
                          key={member.user.id}
                          member={member}
                          isEditorialBoardMember={isEditorialBoardMember}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Other roles not in the predefined order */}
            {Object.keys(groupedByRole)
              .filter((role: string) => !roleOrder.includes(role))
              .map((role: string, roleIndex: number) => {
                const members: EditorialBoardMember[] =
                  groupedByRole[role] || [];
                if (members.length === 0) return null;

                const roleLabel = formatRoleLabel(role);
                const hasPreviousGroups = roleOrder.some(
                  (r) => groupedByRole[r]?.length > 0
                );

                return (
                  <div key={role}>
                    {(roleIndex > 0 || hasPreviousGroups) && (
                      <div className="my-8">
                        <Separator className="bg-gray-200" />
                      </div>
                    )}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        {roleLabel}
                        {members.length > 1 && (
                          <span className="text-base font-normal text-gray-500 ml-2">
                            ({members.length})
                          </span>
                        )}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {members.map((member: EditorialBoardMember) => (
                          <MemberCard
                            key={member.user.id}
                            member={member}
                            isEditorialBoardMember={false}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <LeftSideBar />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
