// components/admin/menus/list/TableCells.jsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { menuService } from '@/api/services/admin/menuService';

export const StatusCell = ({ menu, onStatusChange }) => {
  const handleStatusToggle = async () => {
    try {
      // Create the data object with all required fields
      const menuData = {
        name: menu.name,
        ordering: menu.ordering,
        status: menu.status === 1 ? 0 : 1,
      };

      await menuService.updateMenu(menu.id, menuData);

      // Only update UI after successful API call
      onStatusChange(menu.id, menu.status);

      toast.success(`Menu ${menu.status === 1 ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error('Error updating menu status:', error);
      toast.error('Failed to update menu status');
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {/* <Switch
        checked={menu.status === 1}
        onCheckedChange={handleStatusToggle}
        aria-label={`Toggle status for ${menu.name}`}
        className="data-[state=checked]:bg-black data-[state=checked]:text-white"
      /> */}
      <Badge
        variant={menu.status === 1 ? 'success' : 'destructive'}
        className={menu.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
      >
        {menu.status === 1 ? 'Active' : 'Inactive'}
      </Badge>
    </div>
  );
};

export const ActionsCell = ({ menu, onDelete }) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await menuService.deleteMenu(menu.id);
      onDelete(menu.id);
      toast.success('Menu deleted successfully');
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('Failed to delete menu');
    }
  };

  return (
    <div className="flex justify-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push(`/admin/menus/${menu.id}/edit`)}
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>

      {/* <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-800 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{menu.name}" menu and all its items. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
};
