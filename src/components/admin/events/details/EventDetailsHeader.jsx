'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarRange, Star, Users } from 'lucide-react';

const EventDetailsHeader = ({ event }) => {
  return (
    <Card>
      <div className="relative">
        {/* Event image */}
        <div className="w-full h-48 overflow-hidden">
          {event.featured_image ? (
            <img
              src={event.featured_image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Status badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge
            variant={event.event_status === 1 ? 'default' : 'secondary'}
            className={
              event.event_status === 1
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
            }
          >
            {event.event_status === 1 ? 'Active' : 'Inactive'}
          </Badge>
          {event.is_featured === 1 && (
            <Badge
              variant="outline"
              className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
            >
              Featured
            </Badge>
          )}
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <CalendarRange className="h-4 w-4 mr-1" />
          {event.start_date && format(new Date(event.start_date), 'MMM d, yyyy')} -
          {event.end_date && format(new Date(event.end_date), 'MMM d, yyyy')}
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>{event.description}</p>
        </div>

        {/* Qurbani Pricing Section */}
        {event.is_qurbani_donation === 1 && event.qurbani_pricing && (
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                Qurbani Pricing Options
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Cow Price */}
              {event.qurbani_pricing.cow_price && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🐄</div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Cow</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      ${Number.parseFloat(event.qurbani_pricing.cow_price).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {/* Goat Price */}
              {event.qurbani_pricing.goat_price && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🐐</div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">Goat</p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                      ${Number.parseFloat(event.qurbani_pricing.goat_price).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {/* Lamb Price */}
              {event.qurbani_pricing.lamb_price && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🐑</div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">Lamb</p>
                    <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                      ${Number.parseFloat(event.qurbani_pricing.lamb_price).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center mt-4">
              <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                <Star className="h-3 w-3 mr-1" />
                Qurbani Donation Event
              </Badge>
            </div>
          </div>
        )}

        {/* Qurbani Donations Table */}
        {event.is_qurbani_donation === 1 && event.qurbani_donations && event.qurbani_donations.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                Qurbani Donations Received
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-green-100 dark:bg-green-900/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-green-900 dark:text-green-100">Animal Type</th>
                    <th className="text-left p-3 font-medium text-green-900 dark:text-green-100">Donor</th>
                    <th className="text-left p-3 font-medium text-green-900 dark:text-green-100">Participants</th>
                    <th className="text-left p-3 font-medium text-green-900 dark:text-green-100">Amount</th>
                    <th className="text-left p-3 font-medium text-green-900 dark:text-green-100">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                  {event.qurbani_donations.map((donation, index) => (
                    <tr key={index} className="border-b border-green-100 dark:border-green-800">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {donation.animal_type === 'cow' ? '🐄' : 
                             donation.animal_type === 'goat' ? '🐐' : 
                             donation.animal_type === 'lamb' ? '🐑' : '🐄'}
                          </span>
                          <span className="font-medium capitalize text-gray-900 dark:text-gray-100">
                            {donation.animal_type}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-900 dark:text-gray-100">
                        {donation.donor_name || 'Anonymous'}
                      </td>
                      <td className="p-3">
                        {donation.units && donation.units.length > 0 ? (
                          <div className="space-y-1">
                            {donation.units.map((unit, unitIndex) => (
                              <div key={unitIndex} className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                <div className="font-medium text-gray-900 dark:text-gray-100">{unit.name}</div>
                                <div className="text-gray-600 dark:text-gray-400">{unit.address}</div>
                                {(unit.father_name || unit.mother_name) && (
                                  <div className="text-gray-500 dark:text-gray-500 text-xs">
                                    {unit.father_name && `Father: ${unit.father_name}`}
                                    {unit.father_name && unit.mother_name && ' | '}
                                    {unit.mother_name && `Mother: ${unit.mother_name}`}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">No participants listed</span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-green-600 dark:text-green-400">
                        ${Number(donation.amount || 0).toFixed(2)}
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">
                        {donation.created_at ? format(new Date(donation.created_at), 'MMM d, yyyy') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                <Users className="h-3 w-3 mr-1" />
                Total Donations: {event.qurbani_donations.length}
              </Badge>
              <div className="text-sm font-medium text-green-900 dark:text-green-100">
                Total Amount: ${event.qurbani_donations.reduce((sum, d) => sum + Number(d.amount || 0), 0).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventDetailsHeader;
