// src/api/services/admin/protected/faqService.js

/**
 * Protected FAQ Service
 * FAQ service with automatic permission checking
 */

import { faqPermissions } from '@/api/middleware/permissionMiddleware';
import * as originalFaqService from '@/api/services/admin/faqService';

// ==================== PROTECTED FAQ OPERATIONS ====================

/**
 * Create a new FAQ (requires faq_create permission)
 */
export const createFaq = faqPermissions.withCreatePermission(
  originalFaqService.createFaq,
  {
    context: { operation: 'createFaq' }
  }
);

/**
 * Get all FAQs (requires faq_view permission)
 */
export const getAllFaqs = faqPermissions.withViewPermission(
  originalFaqService.getAllFaqs,
  {
    context: { operation: 'getAllFaqs' }
  }
);

/**
 * Get FAQ by ID (requires faq_view permission)
 */
export const getFaqById = faqPermissions.withViewPermission(
  originalFaqService.getFaqById,
  {
    context: { operation: 'getFaqById' }
  }
);

/**
 * Update FAQ (requires faq_edit permission)
 */
export const updateFaq = faqPermissions.withEditPermission(
  originalFaqService.updateFaq,
  {
    context: { operation: 'updateFaq' }
  }
);

/**
 * Delete FAQ (requires faq_delete permission)
 */
export const deleteFaq = faqPermissions.withDeletePermission(
  originalFaqService.deleteFaq,
  {
    context: { operation: 'deleteFaq' }
  }
);

// ==================== UTILITY FUNCTIONS (NO PERMISSION REQUIRED) ====================

/**
 * Validate FAQ data (utility function - no permission required)
 */
export const validateFaqData = originalFaqService.validateFaqData;

/**
 * Format FAQ data for submission (utility function - no permission required)
 */
export const formatFaqDataForSubmission = originalFaqService.formatFaqDataForSubmission;

/**
 * Check if ordering is in use (utility function - no permission required)
 */
export const isOrderingInUse = originalFaqService.isOrderingInUse;

/**
 * Get next available ordering (utility function - no permission required)
 */
export const getNextAvailableOrdering = originalFaqService.getNextAvailableOrdering;

/**
 * Sort FAQs by ordering (utility function - no permission required)
 */
export const sortFaqsByOrdering = originalFaqService.sortFaqsByOrdering;

/**
 * Group FAQs by status (utility function - no permission required)
 */
export const groupFaqsByStatus = originalFaqService.groupFaqsByStatus;

/**
 * Search FAQs (utility function - no permission required)
 */
export const searchFaqs = originalFaqService.searchFaqs;