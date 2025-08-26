import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const RequestsPagination = ({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
  indexOfFirstItem,
  indexOfLastItem,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
      <div className="text-xs text-gray-500">
        Showing {totalItems > 0 ? indexOfFirstItem + 1 : 0} to{' '}
        {Math.min(indexOfLastItem, totalItems)} of {totalItems} requests
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>

          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show 5 pages around current page
              const startPage = Math.max(1, currentPage - 2);
              const endPage = Math.min(totalPages, startPage + 4);
              const adjustedStartPage = Math.max(1, endPage - 4);
              const pageNumber = adjustedStartPage + i;

              if (pageNumber <= totalPages) {
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              }
              return null;
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Items per page:</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1); // Reset to first page when changing items per page
          }}
        >
          <SelectTrigger className="w-16 h-8">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RequestsPagination;
