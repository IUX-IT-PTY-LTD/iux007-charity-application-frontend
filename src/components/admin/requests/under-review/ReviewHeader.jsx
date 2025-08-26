'use client';

import { Clock, Users } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ReviewHeader = () => {
  return (
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Users className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <CardTitle className="flex items-center gap-2">
            Under Review Requests
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              Approval Process
            </Badge>
          </CardTitle>
          <CardDescription>
            Review and approve charity requests that have passed technical validation
          </CardDescription>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Clock className="h-4 w-4" />
        <span>Review deadlines and approval status</span>
      </div>
    </CardHeader>
  );
};

export default ReviewHeader;
