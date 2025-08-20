// components/admin/org/roles/RolesHeader.jsx
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const RolesHeader = ({ onCreateClick }) => {
  return (
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div>
        <CardTitle>Role Management</CardTitle>
        <CardDescription>Manage roles and their permissions</CardDescription>
      </div>

      <Button onClick={onCreateClick} className="bg-blue-600 hover:bg-blue-700 text-white">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Role
      </Button>
    </CardHeader>
  );
};

export default RolesHeader;
