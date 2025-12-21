import { UserCog } from 'lucide-react';
import { Button } from '../ui/button';
import withPermissions from '../WithPermission';
import Loader from '../Loader';

const DeactivateUser = ({
  handleStatusChange,
  isPending,
  isActive,
}: {
  handleStatusChange: () => void;
  isPending: boolean;
  isActive: boolean;
}) => {
  return (
    <Button
      onClick={handleStatusChange}
      disabled={isPending}
      className={`${
        isActive
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      <UserCog className="mr-2 h-5 w-5" />
      {isPending ? (
        <Loader text={isActive ? 'Deactivating...' : 'Activating...'} />
      ) : (
        `${isActive ? 'Deactivate' : 'Activate'} User`
      )}
    </Button>
  );
};

export const DeactivateUserPermission = withPermissions(DeactivateUser);
