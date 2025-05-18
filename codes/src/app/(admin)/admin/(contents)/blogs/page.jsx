'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/admin-context';
import { PlusCircle, FileText, UploadCloud, Loader2 } from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';

// Import custom components
import PostFilters from '@/components/admin/blog/list/PostFilters';
import { PostCardGrid, PostCardList } from '@/components/admin/blog/list/PostCard';
import PostPagination from '@/components/admin/blog/list/PostPagination';

// Import shadcn components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const AdminBlogList = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State for posts and filters
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('Blog Posts');
    setPageSubtitle('Manage all your blog content');
  }, [setPageTitle, setPageSubtitle]);

  // Load posts and categories from localStorage
  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);

      try {
        // Load posts
        const storedPosts = localStorage.getItem('blog_posts');
        let postData = [];

        if (storedPosts) {
          postData = JSON.parse(storedPosts);
        } else {
          // Create sample posts if none exist
          postData = generateSamplePosts();
          localStorage.setItem('blog_posts', JSON.stringify(postData));
        }

        // Load categories
        const storedCategories = localStorage.getItem('blog_categories');
        let categoryData = [];

        if (storedCategories) {
          categoryData = JSON.parse(storedCategories);
        } else {
          // Load sample categories
          categoryData = [
            { id: '1', name: 'Technology', slug: 'technology' },
            { id: '2', name: 'Business', slug: 'business' },
            { id: '3', name: 'Design', slug: 'design' },
            { id: '4', name: 'Development', slug: 'development' },
            { id: '5', name: 'Marketing', slug: 'marketing' },
          ];
          localStorage.setItem('blog_categories', JSON.stringify(categoryData));
        }

        setPosts(postData);
        setCategories(categoryData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to create sample posts for demo purposes
  function generateSamplePosts() {
    const samplePosts = [];
    const statuses = ['draft', 'published', 'scheduled'];
    const categoryIds = ['1', '2', '3', '4', '5'];
    const now = new Date();

    // Generate 12 sample posts
    for (let i = 1; i <= 12; i++) {
      const createdAt = new Date(now);
      createdAt.setDate(now.getDate() - Math.floor(Math.random() * 60)); // Random date within last 60 days

      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // Generate a publish date based on status
      let publishDate;
      if (status === 'published') {
        publishDate = new Date(createdAt);
      } else if (status === 'scheduled') {
        publishDate = new Date(now);
        publishDate.setDate(now.getDate() + Math.floor(Math.random() * 30) + 1); // 1-30 days in future
      } else {
        publishDate = new Date(now); // Draft uses current date
      }

      const samplePost = {
        id: i.toString(),
        title: `Sample Blog Post ${i}`,
        excerpt: `This is a sample excerpt for blog post ${i}. It provides a brief summary of what the post is about.`,
        content: `<h2>Introduction</h2><p>This is sample content for blog post ${i}. It would typically contain paragraphs, images, lists and other formatted content.</p><p>In a real blog post, this would be much longer and contain actual valuable information for the reader.</p><h2>Section 1</h2><p>This is the first section of the blog post with more detailed information.</p><p>You can continue reading to learn more about this topic.</p><h2>Conclusion</h2><p>This is the conclusion of the blog post, summarizing the key points discussed.</p>`,
        category_id: categoryIds[Math.floor(Math.random() * categoryIds.length)],
        tag_ids: [],
        featured_image: `https://picsum.photos/seed/blog${i}/800/600`,
        publish_date: publishDate.toISOString(),
        status: status,
        is_featured: Math.random() > 0.7, // 30% chance of being featured
        allow_comments: Math.random() > 0.2, // 80% chance of allowing comments
        estimated_read_time: `${Math.floor(Math.random() * 10) + 2} min read`,
        created_at: createdAt.toISOString(),
        updated_at: createdAt.toISOString(),
        metadata: {
          title: `Sample Blog Post ${i}`,
          description: `This is a sample excerpt for blog post ${i}. It provides a brief summary of what the post is about.`,
          slug: `sample-blog-post-${i}`,
          canonicalUrl: '',
        },
      };

      samplePosts.push(samplePost);
    }

    return samplePosts;
  }

  // Handle post deletion
  const handleDeletePost = (postId) => {
    try {
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem('blog_posts', JSON.stringify(updatedPosts));
      toast.success('Post deleted successfully');

      /* API Implementation (Commented out for future use)
      fetch(`/api/blog-posts/${postId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(() => {
          const updatedPosts = posts.filter(post => post.id !== postId);
          setPosts(updatedPosts);
          localStorage.setItem("blog_posts", JSON.stringify(updatedPosts));
          toast.success("Post deleted successfully");
        })
        .catch(error => {
          console.error('Error deleting post:', error);
          toast.error("Failed to delete post. Please try again.");
        });
      */
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  // Navigation handlers
  const handleViewPost = (postId) => {
    // This would typically link to the public-facing post
    // For admin purposes, we'll just go to the edit page for now
    router.push(`/admin/blogs/${postId}/preview`);
  };

  const handleEditPost = (postId) => {
    router.push(`/admin/blogs/${postId}/edit`);
  };

  // Filter and sort posts
  const filterAndSortPosts = () => {
    let filteredPosts = [...posts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filteredPosts = filteredPosts.filter((post) => post.category_id === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredPosts = filteredPosts.filter((post) => post.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter) {
      filteredPosts = filteredPosts.filter((post) => {
        const postDate = parseISO(post.publish_date);
        return isSameDay(postDate, dateFilter);
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filteredPosts.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));
        break;
      case 'oldest':
        filteredPosts.sort((a, b) => new Date(a.publish_date) - new Date(b.publish_date));
        break;
      case 'a-z':
        filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        filteredPosts.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));
    }

    return filteredPosts;
  };

  // Apply filters and sorting
  const filteredPosts = filterAndSortPosts();

  // Calculate status counts for filter buttons
  const statusCounts = {
    all: posts.length,
    published: posts.filter((post) => post.status === 'published').length,
    draft: posts.filter((post) => post.status === 'draft').length,
    scheduled: posts.filter((post) => post.status === 'scheduled').length,
  };

  // Calculate pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
        <FileText className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No posts found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {posts.length === 0
          ? "You haven't created any blog posts yet. Create your first post to get started."
          : 'No posts match your current filters. Try adjusting your search or filter criteria.'}
      </p>
      {posts.length === 0 ? (
        <Button
          onClick={() => router.push('/admin/blogs/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Post
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery('');
            setCategoryFilter('all');
            setStatusFilter('all');
            setDateFilter(null);
          }}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            {/* <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and publish your blog content
            </p> */}
          </div>

          <div className="flex gap-2 self-end">
            {/* <Button
              variant="outline"
              onClick={() => {
                // This would typically import posts
                toast.info("Import functionality would go here");
              }}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Import
            </Button> */}
            <Button
              onClick={() => router.push('/admin/blogs/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 pb-0">
            <PostFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={categories}
              statusCounts={statusCounts}
            />
          </CardHeader>

          <CardContent className="p-4">
            {totalPosts === 0 ? (
              renderEmptyState()
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'space-y-4'
                }
              >
                {paginatedPosts.map((post) =>
                  viewMode === 'grid' ? (
                    <PostCardGrid
                      key={post.id}
                      post={post}
                      categories={categories}
                      onView={handleViewPost}
                      onEdit={handleEditPost}
                      confirmDelete={handleDeletePost}
                    />
                  ) : (
                    <PostCardList
                      key={post.id}
                      post={post}
                      categories={categories}
                      onView={handleViewPost}
                      onEdit={handleEditPost}
                      confirmDelete={handleDeletePost}
                    />
                  )
                )}
              </div>
            )}
          </CardContent>

          {totalPosts > 0 && (
            <CardFooter className="p-4 pt-0">
              <PostPagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
                totalItems={totalPosts}
              />
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminBlogList;
