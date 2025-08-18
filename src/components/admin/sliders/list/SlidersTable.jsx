'use client';

import { ArrowUpDown, Edit, Trash2, Image } from 'lucide-react';
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
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={getStatusValue(slider.status) === 1}
                      onCheckedChange={() => handleStatusChange(slider.id, slider.status)}
                      aria-label={`Toggle status for ${slider.title}`}
                      className="data-[state=checked]:bg-black data-[state=checked]:text-white"
                      disabled={isStatusUpdating && selectedSliderId === slider.id}
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
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/sliders/${slider.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>

                    <SliderDeleteDialog
                      slider={slider}
                      onDelete={handleDelete}
                      isDeleting={isDeleting && selectedSliderId === slider.id}
                    />
                  </div>
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
