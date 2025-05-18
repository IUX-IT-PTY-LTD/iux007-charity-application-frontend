'use client';

import React from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Bell, Clock, Eye, Mail, MoreHorizontal, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Component for rendering each notification
const NotificationItem = ({ notification }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'donation':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'user':
        return <User className="h-5 w-5 text-green-500" />;
      case 'system':
        return <Settings className="h-5 w-5 text-yellow-500" />;
      case 'message':
        return <Mail className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) {
      return `${diffInMins}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays}d ago`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  return (
    <div
      className={`p-4 flex items-start ${
        notification.read ? '' : 'bg-blue-50 dark:bg-blue-900/20'
      }`}
    >
      <div className="mr-3 mt-0.5">{getNotificationIcon(notification.type)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium">{notification.title}</p>
          <span className="text-xs text-gray-500">{formatTimeAgo(notification.timestamp)}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
        {notification.actionUrl && (
          <div className="mt-2">
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-blue-600 dark:text-blue-400"
              onClick={() => (window.location.href = notification.actionUrl)}
            >
              {notification.actionText || 'View Details'}
            </Button>
          </div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Mark as {notification.read ? 'unread' : 'read'}</DropdownMenuItem>
          <DropdownMenuItem>Dismiss</DropdownMenuItem>
          {notification.actionUrl && (
            <DropdownMenuItem onClick={() => (window.location.href = notification.actionUrl)}>
              View Details
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Main Notifications Component
const NotificationsPanel = ({ notifications = [], onMarkAllAsRead = () => {} }) => {
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Card className="w-full sm:w-[400px] shadow-lg">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Notifications</CardTitle>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[420px] overflow-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="h-10 w-10 text-gray-300 mb-2 mx-auto" />
            <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/admin/notifications')}
        >
          View All Notifications
        </Button>
      </CardFooter>
    </Card>
  );
};

// Notification Button with Badge
const NotificationsButton = ({
  unreadCount = 0,
  notifications = [],
  onMarkAllAsRead = () => {},
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-0 bg-transparent border-0 shadow-none">
        <NotificationsPanel notifications={notifications} onMarkAllAsRead={onMarkAllAsRead} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { NotificationsPanel, NotificationsButton };
