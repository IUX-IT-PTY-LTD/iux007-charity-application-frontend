// src/api/services/admin/protected/eventService.js

/**
 * Protected Event Service
 * Event service with automatic permission checking
 */

import { eventPermissions } from '@/api/middleware/permissionMiddleware';
import { eventService } from '@/api/services/admin/eventService';

// ==================== PROTECTED EVENT OPERATIONS ====================

/**
 * Get all events with pagination and filters (requires event_view permission)
 */
export const getEvents = eventPermissions.withViewPermission(
  eventService.getEvents.bind(eventService),
  {
    context: { operation: 'getEvents' },
  }
);

/**
 * Get event details by ID (requires event_view permission)
 */
export const getEventDetails = eventPermissions.withViewPermission(
  eventService.getEventDetails.bind(eventService),
  {
    context: { operation: 'getEventDetails' },
  }
);

/**
 * Get event details with donation data (requires event_view permission)
 */
export const getEventWithDonations = eventPermissions.withViewPermission(
  eventService.getEventWithDonations.bind(eventService),
  {
    context: { operation: 'getEventWithDonations' },
  }
);

/**
 * Create a new event (requires event_create permission)
 */
export const createEvent = eventPermissions.withCreatePermission(
  eventService.createEvent.bind(eventService),
  {
    context: { operation: 'createEvent' },
  }
);

/**
 * Update an existing event (requires event_edit permission)
 */
export const updateEvent = eventPermissions.withEditPermission(
  eventService.updateEvent.bind(eventService),
  {
    context: { operation: 'updateEvent' },
  }
);

/**
 * Update event status (requires event_edit permission)
 */
export const updateEventStatus = eventPermissions.withEditPermission(
  eventService.updateEventStatus.bind(eventService),
  {
    context: { operation: 'updateEventStatus' },
  }
);

/**
 * Delete an event (requires event_delete permission)
 */
export const deleteEvent = eventPermissions.withDeletePermission(
  eventService.deleteEvent.bind(eventService),
  {
    context: { operation: 'deleteEvent' },
  }
);

// ==================== UTILITY FUNCTIONS (NO PERMISSION REQUIRED) ====================

/**
 * Validate event data before submission (utility function - no permission required)
 */
export const validateEventData = eventService.validateEventData.bind(eventService);

/**
 * Format event data for API submission (utility function - no permission required)
 */
export const formatEventDataForSubmission =
  eventService.formatEventDataForSubmission.bind(eventService);

// ==================== DIRECT EXPORT OF EVENT SERVICE INSTANCE ====================

/**
 * Export the event service instance for utility access
 * Note: Direct usage bypasses permission checks - use protected methods above
 */
export { eventService };
