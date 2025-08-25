'use client';

import { FileText, ClipboardList } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const RequestsHeader = () => {
  return (
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <ClipboardList className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <CardTitle className="flex items-center gap-2">
            Submitted Requests
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Technical Review
            </Badge>
          </CardTitle>
          <CardDescription>
            Review charity requests and perform technical validation
          </CardDescription>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <FileText className="h-4 w-4" />
        <span>Review requests and update status</span>
      </div>
    </CardHeader>
  );
};

export default RequestsHeader;
