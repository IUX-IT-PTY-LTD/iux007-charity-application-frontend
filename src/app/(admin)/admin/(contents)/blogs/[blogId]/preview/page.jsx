'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Loader2 } from 'lucide-react';

// Import custom components
import PostHeader from '@/components/admin/blog/preview/PostHeader';
import PostContent from '@/components/admin/blog/preview/PostContent';
import AdminActions from '@/components/admin/blog/preview/AdminActions';

// Import shadcn components
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

const BlogPostPreview = props => {
  const params = use(props.params);
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const [post, setPost] = useState(null);
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set page title based on post (will update once post is loaded)
  useEffect(() => {
    if (post) {
      setPageTitle(`Preview: ${post.title}`);
      setPageSubtitle('Preview how your blog post will appear to readers');
    } else {
      setPageTitle('Blog Post Preview');
      setPageSubtitle('Loading preview...');
    }
  }, [post, setPageTitle, setPageSubtitle]);

  // Load post data and related info
  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoading(true);

      try {
        // Fetch post from localStorage
        const storedPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
        const foundPost = storedPosts.find((p) => p.id === params.blogId);

        if (!foundPost) {
          toast.error('Blog post not found');
          router.push('/admin/blogs');
          return;
        }

        setPost(foundPost);

        // Get category info
        const storedCategories = JSON.parse(localStorage.getItem('blog_categories') || '[]');
        const foundCategory = storedCategories.find((c) => c.id === foundPost.category_id);
        setCategory(foundCategory || null);

        // Get tags info if any
        if (foundPost.tag_ids && foundPost.tag_ids.length > 0) {
          const storedTags = JSON.parse(localStorage.getItem('blog_tags') || '[]');
          const foundTags = storedTags.filter((tag) => foundPost.tag_ids.includes(tag.id));
          setTags(foundTags);
        }

        /* API Implementation (Commented out for future use)
        // Fetch post data
        const postResponse = await fetch(`/api/blog-posts/${params.blogId}`);
        if (!postResponse.ok) {
          throw new Error('Failed to fetch blog post');
        }
        const postData = await postResponse.json();
        setPost(postData);
        
        // Fetch category
        if (postData.category_id) {
          const categoryResponse = await fetch(`/api/categories/${postData.category_id}`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            setCategory(categoryData);
          }
        }
        
        // Fetch tags
        if (postData.tag_ids && postData.tag_ids.length > 0) {
          const tagsResponse = await fetch(`/api/tags?ids=${postData.tag_ids.join(',')}`);
          if (tagsResponse.ok) {
            const tagsData = await tagsResponse.json();
            setTags(tagsData);
          }
        }
        */
      } catch (error) {
        console.error('Error fetching blog post data:', error);
        toast.error('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.blogId) {
      fetchPostData();
    }
  }, [params.blogId, router]);

  // Handle post deletion
  const handleDeletePost = (postId) => {
    try {
      const storedPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
      const updatedPosts = storedPosts.filter((post) => post.id !== postId);
      localStorage.setItem('blog_posts', JSON.stringify(updatedPosts));

      toast.success('Blog post deleted successfully');
      router.push('/admin/blogs');

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
          toast.success("Blog post deleted successfully");
          router.push('/admin/blog');
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

  // Show loading state
  if (isLoading || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
          <p className="text-muted-foreground">Loading blog post preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Admin action bar */}
        <AdminActions post={post} onDelete={handleDeletePost} />

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8 mt-4">
          {/* Featured image */}
          {post.featured_image && (
            <div className="mb-6 -mx-6 md:-mx-8 -mt-6 md:-mt-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-t-lg"
              />
            </div>
          )}

          {/* Post header with metadata */}
          <PostHeader post={post} category={category} />

          {/* Post content */}
          <PostContent content={post.content} />

          {/* Tags section if any */}
          {tags.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Tags:</span>
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Post info footer */}
          <footer className="mt-8 pt-6 border-t text-sm text-muted-foreground">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Status:</strong>{' '}
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </p>
                <p>
                  <strong>Published:</strong>{' '}
                  {post.publish_date
                    ? new Date(post.publish_date).toLocaleDateString()
                    : 'Not published'}
                </p>
              </div>
              <div>
                <p>
                  <strong>Comments:</strong> {post.allow_comments ? 'Enabled' : 'Disabled'}
                </p>
                <p>
                  <strong>Featured:</strong> {post.is_featured ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </footer>
        </article>

        {/* SEO Preview section */}
        {post.metadata && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">SEO Preview</h2>
            <Separator className="mb-4" />
            <div className="space-y-1">
              <p className="text-blue-600 text-base font-medium">
                {post.metadata.title || post.title}
              </p>
              <p className="text-green-700 text-xs">
                yourdomain.com/{post.metadata.slug || `blog/${post.id}`}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {post.metadata.description || post.excerpt}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostPreview;
