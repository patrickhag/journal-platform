import Protected from '@/components/Protected';

export default async function ParticularUserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Protected allowedRoles={['CHIEF_EDITOR', 'ASSOCIATE_EDITOR']}>
      <div>{children}</div>
    </Protected>
  );
}
