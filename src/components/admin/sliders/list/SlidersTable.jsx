'use client';

import { ArrowUpDown, Edit, Trash2, Image, Lock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import SliderDeleteDialog from './SliderDeleteDialog';
import { toast } from 'sonner';

// Import permission hooks
import { useSliderPermissions } from '@/api/hooks/useModulePermissions';

// Permission-aware action button component
const PermissionAwareActionButton = ({ permission, children, disabledFallback, ...props }) => {
  const sliderPermissions = useSliderPermissions();

  if (sliderPermissions.isLoading) {
    return (
      <Button {...props} disabled>
        Loading...
      </Button>
    );
  }

  const hasPermission =
    permission === 'edit'
      ? sliderPermissions.canEdit
      : permission === 'delete'
        ? sliderPermissions.canDelete
        : permission === 'view'
          ? sliderPermissions.canView
          : false;

  if (!hasPermission) {
    if (disabledFallback) {
      return (
        <Button
          {...props}
          disabled
          title="You don't have permission for this action"
          className="opacity-50 cursor-not-allowed"
        >
          {disabledFallback}
        </Button>
      );
    }
    return (
      <Button
        {...props}
        disabled
        title="You don't have permission for this action"
        className="opacity-50 cursor-not-allowed"
      >
        <Lock className="h-4 w-4" />
      </Button>
    );
  }

  return <Button {...props}>{children}</Button>;
};

// Permission-aware status cell
const StatusCell = ({
  slider,
  handleStatusChange,
  isStatusUpdating,
  selectedSliderId,
  getStatusValue,
}) => {
  const sliderPermissions = useSliderPermissions();

  const handleStatusToggle = async () => {
    if (!sliderPermissions.canEdit) {
      toast.error("You don't have permission to edit sliders");
      return;
    }

    // Call the parent handler which already has permission checking and API logic
    handleStatusChange(slider.id, slider.status);
  };

  return (
    <div className="flex items-center gap-3">
      <Switch
        checked={getStatusValue(slider.status) === 1}
        onCheckedChange={handleStatusToggle}
        aria-label={`Toggle status for ${slider.title}`}
        className="data-[state=checked]:bg-black data-[state=checked]:text-white"
        disabled={
          !sliderPermissions.canEdit || (isStatusUpdating && selectedSliderId === slider.id)
        }
        title={!sliderPermissions.canEdit ? "You don't have permission to edit sliders" : ''}
      />
      <Badge
        variant={getStatusValue(slider.status) === 1 ? 'success' : 'destructive'}
        className={
          getStatusValue(slider.status) === 1
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }
      >
        {getStatusValue(slider.status) === 1 ? 'Active' : 'Inactive'}
      </Badge>
    </div>
  );
};

// Permission-aware actions cell
const ActionsCell = ({ slider, handleDelete, isDeleting, selectedSliderId, router }) => {
  const sliderPermissions = useSliderPermissions();

  const handleEdit = () => {
    if (sliderPermissions.canEdit) {
      router.push(`/admin/sliders/${slider.id}/edit`);
    }
  };

  return (
    <div className="flex justify-center gap-2">
      <PermissionAwareActionButton
        permission="edit"
        variant="ghost"
        size="icon"
        onClick={handleEdit}
        disabledFallback={<Edit className="h-4 w-4" />}
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </PermissionAwareActionButton>

      {/* Delete button with permission checking */}
      {sliderPermissions.canDelete ? (
        <SliderDeleteDialog
          slider={slider}
          onDelete={handleDelete}
          isDeleting={isDeleting && selectedSliderId === slider.id}
        />
      ) : (
        <Button
          variant="ghost"
          size="icon"
          disabled
          title="You don't have permission to delete sliders"
          className="opacity-50 cursor-not-allowed text-red-600"
        >
          <Lock className="h-4 w-4" />
          <span className="sr-only">Delete (No Permission)</span>
        </Button>
      )}
    </div>
  );
};

const SlidersTable = ({
  sliders,
  isLoading,
  handleSort,
  sortField,
  sortDirection,
  handleStatusChange,
  handleDelete,
  isStatusUpdating,
  isDeleting,
  selectedSliderId,
  getStatusValue,
  router,
  sliderPermissions,
}) => {
  // Column definitions for sortable headers
  const columns = [
    { field: 'image', label: 'Image', sortable: false },
    { field: 'title', label: 'Title', sortable: true },
    { field: 'description', label: 'Description', sortable: true },
    { field: 'ordering', label: 'Order', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
    { field: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.field}
                className={column.sortable ? 'cursor-pointer select-none' : ''}
                onClick={column.sortable ? () => handleSort(column.field) : undefined}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <ArrowUpDown
                      className={`h-3 w-3 ${sortField === column.field ? 'text-blue-600' : ''}`}
                    />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
                  <span className="ml-2">Loading sliders...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : !sliderPermissions.canView ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Lock className="h-8 w-8 text-gray-400" />
                  <p>You don't have permission to view sliders</p>
                </div>
              </TableCell>
            </TableRow>
          ) : sliders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Image className="h-8 w-8 text-gray-400 mb-2" />
                  <p>No sliders found.</p>
                  <p className="text-sm text-gray-500">Try adjusting your search criteria.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sliders.map((slider) => (
              <TableRow key={slider.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableCell>
                  {slider.image ? (
                    <div className="h-16 w-32 overflow-hidden rounded-md">
                      <img
                        src={slider.image}
                        alt={slider.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-32 bg-gray-200 rounded-md flex items-center justify-center">
                      <Image className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{slider.title}</div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="truncate" title={slider.description}>
                      {slider.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{slider.ordering}</TableCell>
                <TableCell>
                  <StatusCell
                    slider={slider}
                    handleStatusChange={handleStatusChange}
                    isStatusUpdating={isStatusUpdating}
                    selectedSliderId={selectedSliderId}
                    getStatusValue={getStatusValue}
                  />
                </TableCell>
                <TableCell>
                  <ActionsCell
                    slider={slider}
                    handleDelete={handleDelete}
                    isDeleting={isDeleting}
                    selectedSliderId={selectedSliderId}
                    router={router}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SlidersTable;
