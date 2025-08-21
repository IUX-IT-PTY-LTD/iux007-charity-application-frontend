"use client";

import React, { useState } from 'react';
import { generateAllPermissions, generateModulePermissions } from '@/api/scripts/permission-generator.js';
import { auditPermissions } from '@/api/scripts/permission-audit.js';

const PermissionGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState(null);
  const [auditResult, setAuditResult] = useState(null);

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    setResult(null);
    try {
      console.log('🚀 Starting permission generation...');
      const result = await generateAllPermissions();
      setResult(result);
      console.log('✅ Generation complete:', result);
    } catch (error) {
      console.error('❌ Generation failed:', error);
      setResult({ error: error.message, stack: error.stack });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAudit = async () => {
    setIsAuditing(true);
    setAuditResult(null);
    try {
      console.log('🔍 Starting permission audit...');
      const result = await auditPermissions();
      setAuditResult(result);
      console.log('✅ Audit complete:', result);
    } catch (error) {
      console.error('❌ Audit failed:', error);
      setAuditResult({ error: error.message });
    } finally {
      setIsAuditing(false);
    }
  };

  const handleGenerateModule = async (module) => {
    setIsGenerating(true);
    try {
      console.log(`🚀 Generating permissions for ${module}...`);
      const result = await generateModulePermissions(module);
      setResult({ module, ...result });
      console.log(`✅ ${module} permissions generated:`, result);
    } catch (error) {
      console.error(`❌ ${module} generation failed:`, error);
      setResult({ error: error.message, module });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Permission Management Tools</h2>
      
      {/* Generation Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Generate Permissions</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <button 
            onClick={handleGenerateAll} 
            disabled={isGenerating || isAuditing}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate All Permissions'}
          </button>
          
          <button 
            onClick={handleAudit} 
            disabled={isGenerating || isAuditing}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors"
          >
            {isAuditing ? 'Auditing...' : 'Audit Permissions'}
          </button>
        </div>

        {/* Module-specific generation */}
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2 text-gray-600">Generate by Module:</h4>
          <div className="flex flex-wrap gap-2">
            {['admin', 'role', 'event', 'faq', 'slider', 'menu', 'contact', 'user'].map(module => (
              <button
                key={module}
                onClick={() => handleGenerateModule(module)}
                disabled={isGenerating || isAuditing}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                {module}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Generation Results</h3>
          <div className="bg-gray-50 border rounded-lg p-4 overflow-auto max-h-96">
            {result.error ? (
              <div className="text-red-600">
                <p className="font-semibold">❌ Error:</p>
                <p className="mb-2">{result.error}</p>
                {result.stack && (
                  <pre className="text-xs bg-red-50 p-2 rounded overflow-auto">
                    {result.stack}
                  </pre>
                )}
              </div>
            ) : (
              <div className="text-green-600">
                <p className="font-semibold">✅ Success!</p>
                {result.module && <p className="mb-2">Module: {result.module}</p>}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Created:</span> {result.created || 0}
                  </div>
                  <div>
                    <span className="font-medium">Existing:</span> {result.existing || 0}
                  </div>
                  <div>
                    <span className="font-medium">Errors:</span> {result.errors || 0}
                  </div>
                  <div>
                    <span className="font-medium">Total:</span> {result.totalCreated || 0}
                  </div>
                </div>
                
                {result.results && (
                  <details className="mt-3">
                    <summary className="cursor-pointer font-medium">View Details</summary>
                    <pre className="text-xs mt-2 bg-white p-2 rounded border overflow-auto">
                      {JSON.stringify(result.results, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit Results Section */}
      {auditResult && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Audit Results</h3>
          <div className="bg-gray-50 border rounded-lg p-4 overflow-auto max-h-96">
            {auditResult.error ? (
              <div className="text-red-600">
                <p className="font-semibold">❌ Audit Error:</p>
                <p>{auditResult.error}</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                  <div className="text-blue-600">
                    <span className="font-medium">Required:</span> {auditResult.total?.required || 0}
                  </div>
                  <div className="text-green-600">
                    <span className="font-medium">Existing:</span> {auditResult.total?.existing || 0}
                  </div>
                  <div className="text-purple-600">
                    <span className="font-medium">Matching:</span> {auditResult.total?.matching || 0}
                  </div>
                  <div className="text-orange-600">
                    <span className="font-medium">Missing:</span> {auditResult.total?.missing || 0}
                  </div>
                  <div className="text-red-600">
                    <span className="font-medium">Extra:</span> {auditResult.total?.extra || 0}
                  </div>
                </div>

                {auditResult.isComplete ? (
                  <p className="text-green-600 font-semibold">✅ All permissions are in sync!</p>
                ) : (
                  <p className="text-orange-600 font-semibold">⚠️ Some permissions need attention.</p>
                )}

                <details className="mt-3">
                  <summary className="cursor-pointer font-medium">View Full Audit Report</summary>
                  <pre className="text-xs mt-2 bg-white p-2 rounded border overflow-auto">
                    {JSON.stringify(auditResult, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
        <ol className="text-blue-700 text-sm space-y-1">
          <li>1. Click "Generate All Permissions" to create all required permissions</li>
          <li>2. Use "Audit Permissions" to check if all permissions exist</li>
          <li>3. Use module-specific buttons to generate permissions for individual modules</li>
          <li>4. Check the browser console for detailed logs</li>
        </ol>
      </div>
    </div>
  );
};

export default PermissionGenerator;