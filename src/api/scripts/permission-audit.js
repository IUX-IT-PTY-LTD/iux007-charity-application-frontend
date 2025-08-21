/**
 * Simple Permission Audit Tool
 * Compares existing permissions with required permissions
 */

import { getAllPermissions } from '@/api/services/admin/permissionService.js';
import { getAllRequiredPermissions } from '@/api/config/permissions.js';

/**
 * Audit current permissions against required permissions
 * @returns {Promise<Object>} Audit results
 */
export const auditPermissions = async () => {
  console.log('🔍 Starting permission audit...');

  try {
    // Get existing permissions from database
    const existingResponse = await getAllPermissions();
    const existingPermissions = existingResponse.data || [];
    const existingNames = existingPermissions.map((p) => p.name);

    // Get required permissions from configuration
    const requiredPermissions = getAllRequiredPermissions();

    // Find missing permissions (required but not existing)
    const missingPermissions = requiredPermissions.filter(
      (required) => !existingNames.includes(required)
    );

    // Find extra permissions (existing but not required)
    const extraPermissions = existingNames.filter(
      (existing) => !requiredPermissions.includes(existing)
    );

    // Find matching permissions
    const matchingPermissions = requiredPermissions.filter((required) =>
      existingNames.includes(required)
    );

    // Generate report
    const report = {
      total: {
        required: requiredPermissions.length,
        existing: existingNames.length,
        matching: matchingPermissions.length,
        missing: missingPermissions.length,
        extra: extraPermissions.length,
      },
      permissions: {
        required: requiredPermissions,
        existing: existingNames,
        matching: matchingPermissions,
        missing: missingPermissions,
        extra: extraPermissions,
      },
      isComplete: missingPermissions.length === 0,
      hasExtras: extraPermissions.length > 0,
    };

    // Print report
    console.log('\n📊 AUDIT REPORT:');
    console.log(`Required Permissions: ${report.total.required}`);
    console.log(`Existing Permissions: ${report.total.existing}`);
    console.log(`Matching Permissions: ${report.total.matching}`);
    console.log(`Missing Permissions: ${report.total.missing}`);
    console.log(`Extra Permissions: ${report.total.extra}`);

    if (report.total.missing > 0) {
      console.log('\n❌ MISSING PERMISSIONS:');
      missingPermissions.forEach((permission) => {
        console.log(`  - ${permission}`);
      });
    }

    if (report.total.extra > 0) {
      console.log('\n⚠️  EXTRA PERMISSIONS:');
      extraPermissions.forEach((permission) => {
        console.log(`  - ${permission}`);
      });
    }

    if (report.isComplete && !report.hasExtras) {
      console.log('\n✅ Perfect! All permissions are in sync.');
    } else if (report.isComplete) {
      console.log('\n✅ All required permissions exist, but there are extras.');
    } else {
      console.log('\n❌ Some required permissions are missing.');
    }

    return report;
  } catch (error) {
    console.error('💥 Error during permission audit:', error);
    throw error;
  }
};

/**
 * Get a simple summary of permission status
 * @returns {Promise<Object>} Simple status summary
 */
export const getPermissionStatus = async () => {
  try {
    const audit = await auditPermissions();
    return {
      isComplete: audit.isComplete,
      missingCount: audit.total.missing,
      extraCount: audit.total.extra,
      totalRequired: audit.total.required,
      totalExisting: audit.total.existing,
    };
  } catch (error) {
    console.error('Error getting permission status:', error);
    return {
      isComplete: false,
      missingCount: -1,
      extraCount: -1,
      totalRequired: -1,
      totalExisting: -1,
      error: error.message,
    };
  }
};

// For running directly in browser console
if (typeof window !== 'undefined') {
  window.auditPermissions = auditPermissions;
  window.getPermissionStatus = getPermissionStatus;
}
