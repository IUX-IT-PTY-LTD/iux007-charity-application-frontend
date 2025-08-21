// src/api/services/admin/protected/contactService.js

/**
 * Protected Contact Service
 * Contact service with automatic permission checking
 */

import { contactPermissions } from '@/api/middleware/permissionMiddleware';
import { contactService } from '@/api/services/admin/contactService';

// ==================== PROTECTED CONTACT OPERATIONS ====================

/**
 * Get all contact information (requires contact_view permission)
 */
export const getAllContacts = contactPermissions.withViewPermission(
  contactService.getAllContacts.bind(contactService),
  {
    context: { operation: 'getAllContacts' },
  }
);

/**
 * Get contact details by ID (requires contact_view permission)
 */
export const getContactDetails = contactPermissions.withViewPermission(
  contactService.getContactDetails.bind(contactService),
  {
    context: { operation: 'getContactDetails' },
  }
);

/**
 * Update contact information (requires contact_edit permission)
 */
export const updateContact = contactPermissions.withEditPermission(
  contactService.updateContact.bind(contactService),
  {
    context: { operation: 'updateContact' },
  }
);

/**
 * Toggle contact status (requires contact_edit permission)
 */
export const toggleContactStatus = contactPermissions.withEditPermission(
  contactService.toggleContactStatus.bind(contactService),
  {
    context: { operation: 'toggleContactStatus' },
  }
);

// ==================== DIRECT EXPORT OF CONTACT SERVICE INSTANCE ====================

/**
 * Export the contact service instance for utility access
 * Note: Direct usage bypasses permission checks - use protected methods above
 */
export { contactService };
