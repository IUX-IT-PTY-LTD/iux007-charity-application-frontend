'use client';

import { CheckCircle, Calendar } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ApprovedHeader = () => {
  return (
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-50 rounded-lg">
          <CheckCircle className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <CardTitle className="flex items-center gap-2">
            Approved Requests
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
              Event Connection
            </Badge>
          </CardTitle>
          <CardDescription>Connect approved charity requests to charity events</CardDescription>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="h-4 w-4" />
        <span>Link requests to events</span>
      </div>
    </CardHeader>
  );
};

export default ApprovedHeader;
