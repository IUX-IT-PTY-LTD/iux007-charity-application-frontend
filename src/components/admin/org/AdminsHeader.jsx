// components/admin/admins/list/AdminsHeader.jsx
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AdminsHeader = ({ onCreateClick }) => {
  return (
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div>
        <CardTitle>Admin Management</CardTitle>
        <CardDescription>Manage admin users and their permissions</CardDescription>
      </div>

      <Button onClick={onCreateClick} className="bg-blue-600 hover:bg-blue-700 text-white">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Admin
      </Button>
    </CardHeader>
  );
};

export default AdminsHeader;
