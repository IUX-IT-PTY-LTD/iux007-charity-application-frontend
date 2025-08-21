/**
 * Simple Permission Generator Script
 * Creates all required permissions for the application
 */

import { MODULE_PERMISSIONS } from '@/api/config/permissions.js';
import { createModulePermissions } from '@/api/services/admin/permissionService.js';

/**
 * Generate all permissions for all modules
 */
export const generateAllPermissions = async () => {
  console.log('🚀 Starting permission generation...');

  const results = [];
  let totalCreated = 0;
  let totalExisting = 0;
  let totalErrors = 0;

  try {
    // Process each module
    for (const [module, actions] of Object.entries(MODULE_PERMISSIONS)) {
      console.log(`\n📋 Processing module: ${module}`);
      console.log(`Actions: ${actions.join(', ')}`);

      try {
        const result = await createModulePermissions(module, actions);
        results.push(result);

        totalCreated += result.created;
        totalExisting += result.existing;
        totalErrors += result.errors;

        console.log(
          `✅ ${module}: ${result.created} created, ${result.existing} existing, ${result.errors} errors`
        );
      } catch (error) {
        console.error(`❌ Failed to process module ${module}:`, error.message);
        results.push({
          module,
          status: 'failed',
          error: error.message,
        });
        totalErrors++;
      }
    }

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`Total Created: ${totalCreated}`);
    console.log(`Total Existing: ${totalExisting}`);
    console.log(`Total Errors: ${totalErrors}`);
    console.log(`Modules Processed: ${Object.keys(MODULE_PERMISSIONS).length}`);

    if (totalErrors === 0) {
      console.log('🎉 All permissions generated successfully!');
    } else {
      console.log('⚠️  Some permissions failed to generate. Check the logs above.');
    }

    return {
      success: totalErrors === 0,
      totalCreated,
      totalExisting,
      totalErrors,
      results,
    };
  } catch (error) {
    console.error('💥 Fatal error during permission generation:', error);
    throw error;
  }
};

/**
 * Generate permissions for a specific module
 * @param {string} module - Module name
 */
export const generateModulePermissions = async (module) => {
  if (!MODULE_PERMISSIONS[module]) {
    throw new Error(`Module '${module}' not found in configuration`);
  }

  console.log(`🚀 Generating permissions for module: ${module}`);

  const actions = MODULE_PERMISSIONS[module];
  const result = await createModulePermissions(module, actions);

  console.log(
    `✅ Result: ${result.created} created, ${result.existing} existing, ${result.errors} errors`
  );

  return result;
};

// For running directly in browser console or as a utility
if (typeof window !== 'undefined') {
  window.generateAllPermissions = generateAllPermissions;
  window.generateModulePermissions = generateModulePermissions;
}
