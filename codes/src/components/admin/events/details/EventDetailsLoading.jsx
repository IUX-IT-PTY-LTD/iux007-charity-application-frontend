'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const EventDetailsLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex flex-col gap-6">
          {/* Actions bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Skeleton className="h-9 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>

          {/* Event details */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left column - Event info */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Event header */}
                <Card>
                  <div className="relative">
                    <Skeleton className="w-full h-48" />
                  </div>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>

                {/* Event info */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-5 w-40" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="grid grid-cols-[20px_1fr] gap-x-3 items-start">
                        <Skeleton className="h-5 w-5" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-5 w-40" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Event stats */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-5 w-40" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-8 w-16 mt-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right column - Donations table */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full mb-4" />
                  
                  <div className="border rounded-md">
                    <div className="p-4">
                      <div className="flex gap-4 py-3 border-b">
                        <Skeleton className="h-5 w-8" />
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                      
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-4 py-4 border-b">
                          <Skeleton className="h-6 w-8" />
                          <div className="w-32">
                            <Skeleton className="h-5 w-full mb-1" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-6 w-40" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsLoading;