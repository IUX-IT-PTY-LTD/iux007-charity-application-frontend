// src/api/services/admin/protected/sliderService.js

/**
 * Protected Slider Service
 * Slider service with automatic permission checking
 */

import { sliderPermissions } from '@/api/middleware/permissionMiddleware';
import * as originalSliderService from '@/api/services/admin/sliderService';

// ==================== PROTECTED SLIDER OPERATIONS ====================

/**
 * Create a new slider (requires slider_create permission)
 */
export const createSlider = sliderPermissions.withCreatePermission(
  originalSliderService.createSlider,
  {
    context: { operation: 'createSlider' },
  }
);

/**
 * Get all sliders (requires slider_view permission)
 */
export const getAllSliders = sliderPermissions.withViewPermission(
  originalSliderService.getAllSliders,
  {
    context: { operation: 'getAllSliders' },
  }
);

/**
 * Update an existing slider (requires slider_edit permission)
 */
export const updateSlider = sliderPermissions.withEditPermission(
  originalSliderService.updateSlider,
  {
    context: { operation: 'updateSlider' },
  }
);

/**
 * Update slider status (requires slider_edit permission)
 */
export const updateSliderStatus = sliderPermissions.withEditPermission(
  originalSliderService.updateSliderStatus,
  {
    context: { operation: 'updateSliderStatus' },
  }
);

/**
 * Delete a slider (requires slider_delete permission)
 */
export const deleteSlider = sliderPermissions.withDeletePermission(
  originalSliderService.deleteSlider,
  {
    context: { operation: 'deleteSlider' },
  }
);

// ==================== UTILITY FUNCTIONS (NO PERMISSION REQUIRED) ====================

/**
 * Validate slider data before submission (utility function - no permission required)
 */
export const validateSliderData = originalSliderService.validateSliderData;

/**
 * Format slider data for API submission (utility function - no permission required)
 */
export const formatSliderDataForSubmission = originalSliderService.formatSliderDataForSubmission;

/**
 * Check if ordering is in use (utility function - no permission required)
 */
export const isOrderingInUse = originalSliderService.isOrderingInUse;

/**
 * Get next available ordering (utility function - no permission required)
 */
export const getNextAvailableOrdering = originalSliderService.getNextAvailableOrdering;

/**
 * Prepare image data for API submission (utility function - no permission required)
 */
export const prepareImageForSubmission = originalSliderService.prepareImageForSubmission;
