/**
 * Example component showing how to use domain-based configuration
 */
'use client';

import React from 'react';
import { getDomainConfig, getConfigValue, isDomain } from '@/utils/domainConfig';

const DomainConfigExample = () => {
  const [config, setConfig] = React.useState(null);
  const [currentDomain, setCurrentDomain] = React.useState('');

  React.useEffect(() => {
    // Get current domain and config
    const domain = window.location.host;
    const domainConfig = getDomainConfig();
    
    setCurrentDomain(domain);
    setConfig(domainConfig);
  }, []);

  if (!config) {
    return <div>Loading configuration...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6" style={{ color: config.THEME_COLOR }}>
        {config.APP_NAME}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Domain Info */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Current Domain</h2>
          <p className="text-gray-600 mb-2">
            <strong>Domain:</strong> {currentDomain}
          </p>
          <p className="text-gray-600">
            <strong>Configuration:</strong> {
              isDomain('custom-domain.com') ? 'Custom Domain Config' :
              isDomain('secondary') ? 'Secondary Config' :
              'Primary Config'
            }
          </p>
        </div>

        {/* Configuration Values */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Active Configuration</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>API URL:</strong>
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                {config.API_BASE_URL}
              </code>
            </div>
            <div>
              <strong>App Name:</strong>
              <span className="ml-2">{config.APP_NAME}</span>
            </div>
            <div>
              <strong>Theme Color:</strong>
              <span 
                className="ml-2 inline-block w-4 h-4 rounded"
                style={{ backgroundColor: config.THEME_COLOR }}
              ></span>
              <code className="ml-1">{config.THEME_COLOR}</code>
            </div>
            <div>
              <strong>S3 Bucket:</strong>
              <span className="ml-2">{config.S3_BUCKET}</span>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Usage Examples</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800">1. Get entire config:</h3>
              <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
{`import { getDomainConfig } from '@/utils/domainConfig';

const config = getDomainConfig();
console.log(config); // All config values for current domain`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-800">2. Get specific value:</h3>
              <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
{`import { getConfigValue } from '@/utils/domainConfig';

const apiUrl = getConfigValue('API_BASE_URL');
const appName = getConfigValue('APP_NAME');`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-800">3. Domain-specific logic:</h3>
              <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
{`import { isDomain } from '@/utils/domainConfig';

if (isDomain('custom-domain.com')) {
  // Show custom domain features
} else if (isDomain('secondary')) {
  // Show secondary domain features
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-800">4. React Hook:</h3>
              <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
{`import { useDomainConfig } from '@/utils/domainConfig';

function MyComponent() {
  const config = useDomainConfig();
  return <div style={{ color: config.THEME_COLOR }}>...</div>;
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Environment Variables Setup</h2>
          <p className="text-gray-600 mb-3">
            Add these environment variables in your Vercel dashboard:
          </p>
          
          <div className="bg-gray-50 p-3 rounded">
            <pre className="text-sm">
{`# Primary domain
NEXT_PUBLIC_API_URL=https://api-primary.example.com
NEXT_PUBLIC_STRIPE_KEY=pk_test_primary_key

# Secondary domain  
NEXT_PUBLIC_API_URL_SECONDARY=https://api-secondary.example.com
NEXT_PUBLIC_STRIPE_KEY_SECONDARY=pk_test_secondary_key

# Custom domain
NEXT_PUBLIC_API_URL_CUSTOM=https://api-custom.example.com
NEXT_PUBLIC_STRIPE_KEY_CUSTOM=pk_live_custom_key`}
            </pre>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Test Different Configurations</h2>
          <div className="space-x-2">
            <button
              onClick={() => {
                const testConfig = getDomainConfig('your-primary-domain.vercel.app');
                setConfig(testConfig);
                setCurrentDomain('your-primary-domain.vercel.app (Test)');
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Primary Config
            </button>
            <button
              onClick={() => {
                const testConfig = getDomainConfig('your-secondary-domain.vercel.app');
                setConfig(testConfig);
                setCurrentDomain('your-secondary-domain.vercel.app (Test)');
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Test Secondary Config
            </button>
            <button
              onClick={() => {
                const testConfig = getDomainConfig('custom-domain.com');
                setConfig(testConfig);
                setCurrentDomain('custom-domain.com (Test)');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Test Custom Config
            </button>
            <button
              onClick={() => {
                const actualDomain = window.location.host;
                const actualConfig = getDomainConfig();
                setConfig(actualConfig);
                setCurrentDomain(actualDomain);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Reset to Actual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainConfigExample;