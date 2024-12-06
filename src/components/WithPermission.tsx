import {
  ROLE_PERMISSIONS,
  TPermissionItem,
  TUserPermissions,
} from '@/lib/roles';

const defaultFallback = <div>Permission Denied</div>;

const withPermissions = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithPermissions: React.FC<
    P &
      TUserPermissions & {
        requiredPermissions: TPermissionItem[];
        fallback?: React.ReactNode;
      }
  > = ({ requiredPermissions, role, fallback = defaultFallback, ...props }) => {
    const userPermissions = ROLE_PERMISSIONS[role];

    // Check if the user has all the required permissions
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    return hasPermission ? <WrappedComponent {...(props as P)} /> : fallback;
  };

  return WithPermissions;
};

export default withPermissions;
