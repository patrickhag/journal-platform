import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ReachOut } from './ReachOut';
import withPermissions from '../WithPermission';

const ReviewerPopUp = ({ email, names }: { email: string; names: string }) => {
  return (
    <>
      <Popover>
        <PopoverTrigger className="w-full md:w-auto bg-slate-900 text-lime-50 px-3 py-1 rounded-md">
          Reach out
        </PopoverTrigger>
        <PopoverContent>
          <ReachOut email={email} names={names} />
        </PopoverContent>
      </Popover>
    </>
  );
};

export const ReviewerPopUpWithPermissions = withPermissions(ReviewerPopUp);
