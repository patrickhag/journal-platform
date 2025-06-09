import { Card } from '@/components/ui/card';
import { PenTool, Edit3, Eye, Shield } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
}

const roles = [
  {
    id: 'author',
    name: 'Author',
    description: 'Create and write content',
    icon: PenTool,
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    selectedColor: 'bg-green-100 border-green-400 ring-2 ring-green-200',
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Edit and manage content',
    icon: Edit3,
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    selectedColor: 'bg-blue-100 border-blue-400 ring-2 ring-blue-200',
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    description: 'Review and approve content',
    icon: Eye,
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    selectedColor: 'bg-purple-100 border-purple-400 ring-2 ring-purple-200',
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full system access',
    icon: Shield,
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
    selectedColor: 'bg-red-100 border-red-400 ring-2 ring-red-200',
  },
];

const RoleSelector = ({ selectedRole, onRoleSelect }: RoleSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-700 mb-1">Login as</h3>
        <p className="text-xs text-gray-500">Select your role to continue</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected ? role.selectedColor : role.color
              }`}
              onClick={() => onRoleSelect(role.id)}
            >
              <div className="p-3 text-center">
                <Icon
                  size={20}
                  className={`mx-auto mb-2 ${
                    isSelected
                      ? role.id === 'author'
                        ? 'text-green-600'
                        : role.id === 'editor'
                          ? 'text-blue-600'
                          : role.id === 'reviewer'
                            ? 'text-purple-600'
                            : 'text-red-600'
                      : 'text-gray-500'
                  }`}
                />
                <div className="text-xs font-medium text-gray-900 mb-1">
                  {role.name}
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                  {role.description}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
