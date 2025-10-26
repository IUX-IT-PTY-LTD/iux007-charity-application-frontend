'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, DollarSign, Calendar, MapPin, Eye, Archive } from 'lucide-react';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import Link from 'next/link';
import Image from 'next/image';

export default function ArchivedProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const sliderFallbackImage = 'https://iux007-charity-application.s3.ap-southeast-2.amazonaws.com/staging/assets/fallback_images/slider_fallback_image.jpg';

  useEffect(() => {
    fetchArchivedProjects();
  }, []);

  const fetchArchivedProjects = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`${ENDPOINTS.EVENTS.LIST}?status=0`);
      if (response && response.status === 'success') {
        setProjects(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching archived projects:', err);
      setError('Failed to load archived projects');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (raised, target) => {
    if (!target || target === 0) return 0;
    return Math.min((raised / target) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Pagination logic
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = projects.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading archived projects...</p>
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
            <Button onClick={fetchArchivedProjects} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Archive className="h-8 w-8 text-gray-600" />
          <h1 className="text-4xl font-bold text-gray-800">Archived Projects</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Explore our completed and archived charitable projects that have made a positive impact.
        </p>
        {/* <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            <strong>{projects.length}</strong> archived projects found
          </p>
        </div> */}
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="text-center py-12">
            <Archive className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Archived Projects</h3>
            <p className="text-gray-600 mb-4">There are currently no archived projects to display.</p>
            <Link href="/">
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProjects.map((project) => {
              const progressPercentage = calculateProgress(project.total_donation, project.target_amount);
              
              // Format dates
              const formatTime = (timeString) => {
                try {
                  const date = new Date(timeString);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                } catch {
                  return timeString;
                }
              };
              
              return (
                <div key={project.id} className="bg-white rounded-2xl p-5 cursor-pointer hover:-translate-y-2 transition-all relative h-full flex flex-col shadow-lg">
                  <div className="overflow-hidden mx-auto mb-4 h-[200px] relative">
                    <Image
                      width={300}
                      height={200}
                      src={project.featured_image || sliderFallbackImage}
                      alt={project.title || 'Archived Event'}
                      className="h-full w-full object-cover rounded-md"
                      loader={({ src }) => src}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/80 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        Archived
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3 text-xs">
                      {project.end_date && (
                        <div className="flex items-center gap-1 bg-primary text-white px-2 py-1 rounded flex-shrink-0">
                          <Calendar className="text-xs" />
                          <span className="whitespace-nowrap text-xs">{formatTime(project.end_date)}</span>
                        </div>
                      )}
                      {project.location && (
                        <div className="flex items-center gap-1 bg-primary text-white px-2 py-1 rounded min-w-0 flex-1">
                          <MapPin className="text-xs flex-shrink-0" />
                          <span className="truncate text-xs" title={project.location}>{project.location}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-medium font-semibold text-gray-800 mb-3 line-clamp-2">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                      {project.description}
                    </p>

                    {/* Progress section */}
                    <div className="mb-4">
                      <div className="bg-gray-50 rounded p-3">
                        <div className="flex items-baseline text-sm mb-2">
                          <span className="font-bold text-primary">{formatCurrency(project.total_donation || 0)}</span>
                          <span className="text-gray-500 ml-1">raised of </span>
                          <span className="font-bold text-primary ml-1">{formatCurrency(project.target_amount || 0)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                          <div
                            className="bg-green-500 h-1.5 rounded-full transition-colors duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{project.total_donor || 0} Donors</span>
                          <span>{progressPercentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="buttons block relative w-full mt-auto">
                      <Link
                        href={`/archived-events/${project.uuid || project.id}`}
                        className="bg-gray-600 text-sm h-full text-white px-5 py-2 rounded-md block text-center w-full hover:bg-gray-700 transition-colors"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {projects.length > itemsPerPage && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                  ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
                  }
                `}
                aria-label="Previous page"
              >
                ←
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                    ${
                      currentPage === index + 1
                        ? 'bg-primary text-white shadow-lg transform scale-105'
                        : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
                    }
                  `}
                  aria-label={`Page ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                  ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
                  }
                `}
                aria-label="Next page"
              >
                →
              </button>
            </div>
          )}

          {/* Results info */}
          {projects.length > 0 && (
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, projects.length)} of {projects.length} archived events
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}