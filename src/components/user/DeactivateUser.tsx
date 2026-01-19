import { UserCog } from 'lucide-react';
import { Button } from '../ui/button';
import withPermissions from '../WithPermission';
import Loader from '../Loader';

const DeactivateUser = ({
  handleStatusChange,
  isActive,
}: {
  handleStatusChange: () => void;
  isActive: boolean;
}) => {
  return (
    <Button
      onClick={handleStatusChange}
      className={`${
        isActive
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      <UserCog className="mr-2 h-5 w-5" />
      {isActive ? 'Deactivate' : 'Activate'} User
    </Button>
  );
};

export const DeactivateUserPermission = withPermissions(DeactivateUser);
