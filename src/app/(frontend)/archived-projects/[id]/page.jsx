'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, use } from 'react';
import { FaArrowLeft, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, Calendar, MapPin, Archive } from 'lucide-react';

const ArchivedEventDetails = props => {
  const params = use(props.params);
  const { id: uuid } = params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const sliderFallbackImage = 'https://iux007-charity-application.s3.ap-southeast-2.amazonaws.com/staging/assets/fallback_images/slider_fallback_image.jpg';

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`${ENDPOINTS.EVENTS.LIST}?status=0`);
        if (response && response.status === 'success') {
          const foundEvent = response.data.find(event => event.uuid === uuid || event.id === uuid);
          if (foundEvent) {
            setEvent(foundEvent);
          } else {
            setError('Archived event not found');
          }
        }
      } catch (err) {
        console.error('Error fetching archived event details:', err);
        setError('Failed to load archived event details');
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchEventDetails();
    }
  }, [uuid]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const calculateProgress = (raised, target) => {
    if (!target || target === 0) return 0;
    return Math.min((raised / target) * 100, 100);
  };

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading archived project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="shadow-lg">
          <CardContent className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/archived-projects">
              <Button variant="outline">
                Back to Archived Projects
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="shadow-lg">
          <CardContent className="text-center py-12">
            <Archive className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Event Not Found</h3>
            <p className="text-gray-600 mb-4">The requested archived event could not be found.</p>
            <Link href="/archived-projects">
              <Button variant="outline">
                Back to Archived Projects
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = calculateProgress(event.total_donation, event.target_amount);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/archived-projects"
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Archived Projects
          </Link>
        </div>

        {/* Archived badge */}
        <div className="flex items-center space-x-3 mb-6">
          <Archive className="h-8 w-8 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
            <p className="text-gray-600">This project has been completed and archived</p>
          </div>
        </div>

        <div className="bg-white p-8 shadow-lg rounded-xl border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="order-2 lg:order-1">
              <div className="relative h-80 w-full rounded-lg overflow-hidden">
                <Image
                  src={event.featured_image || sliderFallbackImage}
                  alt={event.title || 'Archived Event'}
                  fill
                  className="object-cover"
                  loader={({ src }) => src}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-black/80 text-white px-3 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                    Archived
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="order-1 lg:order-2 space-y-6">
              <div>
                {/* <h2 className="text-3xl font-bold text-gray-800 mb-4">{event.title}</h2> */}
                <p className="text-gray-600 leading-relaxed text-lg">{event.description}</p>
              </div>

              {/* Location and dates */}
              <div className="space-y-3">
                {event.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                )}
                {event.start_date && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Started: {formatTime(event.start_date)}</span>
                  </div>
                )}
                {event.end_date && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Ended: {formatTime(event.end_date)}</span>
                  </div>
                )}
              </div>

              {/* Financial Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Final Results</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-6 w-6 text-green-600 mr-1" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Raised</p>
                    <p className="text-2xl font-bold text-green-700">
                      {formatCurrency(event.total_donation)}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-6 w-6 text-blue-600 mr-1" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Donors</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {event.total_donor || 0}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Target: {formatCurrency(event.target_amount)}</span>
                    <span>{progressPercentage.toFixed(1)}% achieved</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {progressPercentage >= 100 && (
                  <div className="bg-green-100 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-green-800 font-medium">🎉 Goal Achieved!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-gray-50 p-8 text-center">
            <p className="text-gray-600 mb-6 text-lg">
              Thank you to everyone who contributed to this campaign. Your support made a real difference!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/archived-projects">
                <Button variant="outline" className="px-6 py-3 border-2 border-primary text-primary transition-all">
                  View More Archived Projects
                </Button>
              </Link>
              <Link href="/projects">
                <Button className="px-6 py-3 bg-primary text-white hover:bg-primary/90 transition-all">
                  View Active Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivedEventDetails;