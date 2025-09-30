import Protected from '@/components/Protected';

export default async function ParticularUserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Protected
      allowedRoles={[
        'CHIEF_EDITOR',
        'ASSOCIATE_EDITOR',
        'STAFF_EDITOR',
        'NORMAL_USER',
      ]}
    >
      <div>{children}</div>
    </Protected>
  );
}
