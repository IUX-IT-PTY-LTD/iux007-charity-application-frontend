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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => {
            const progressPercentage = calculateProgress(project.total_donation, project.target_amount);
            
            return (
              <Card key={project.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                {/* Project Image - Upper Section */}
                <div className="relative h-64 w-full">
                  {project.featured_image ? (
                    <Image
                      src={project.featured_image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Archive className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      Archived
                    </span>
                  </div>
                </div>

                {/* Project Content - Below Image */}
                <div className="p-6 lg:p-8 space-y-6">
                  {/* Project Header */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h3>
                    {project.location && (
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{project.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Project Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {project.description}
                  </p>

                   {/* Project Dates */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {project.start_date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Started: {new Date(project.start_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                        </div>
                      )}
                      {project.end_date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Ended: {new Date(project.end_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                        </div>
                      )}
                    </div>

                  {/* Financial Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-600 mb-1">Total Raised</p>
                      <p className="text-xl font-bold text-green-700">
                        {formatCurrency(project.total_donation)}
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-600 mb-1">Total Donors</p>
                      <p className="text-xl font-bold text-blue-700">
                        {project.total_donor || 0}
                      </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Target Amount</p>
                      <p className="text-xl font-bold text-gray-700">
                        {formatCurrency(project.target_amount)}
                      </p>
                    </div>
                  </div>

                        {/* Progress Bar */}
                        {/* <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600">Funding Progress</span>
                            <span className="text-sm font-medium text-gray-600">{Math.round(progressPercentage)}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-3" />
                        </div> */}
                      </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}