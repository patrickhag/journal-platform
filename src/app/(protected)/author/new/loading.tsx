import Loader from '@/components/Loader';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
      <Loader text="Loading..." />
    </div>
  );
}
