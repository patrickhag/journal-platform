import Protected from '@/components/Protected';

export default async function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Protected allowedRoles={['ADMIN', 'CHIEF_EDITOR']}>
      <div>{children}</div>
    </Protected>
  );
}
