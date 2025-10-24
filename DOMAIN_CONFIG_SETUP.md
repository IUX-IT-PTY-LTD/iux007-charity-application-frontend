# Domain-Based Environment Configuration Setup

This guide explains how to set up different environment variables for different domains in your Vercel deployment.

## 🎯 Overview

With this setup, you can:
- Deploy the same codebase to multiple domains
- Use different API endpoints, Stripe keys, themes, etc. per domain
- Automatically switch configurations based on the visiting domain

## 📁 Files Created

1. `src/utils/domainConfig.js` - Main configuration utility
2. `src/api/config/index.js` - Updated to use domain configs
3. `DOMAIN_CONFIG_SETUP.md` - This documentation

## ⚙️ Setup Instructions

### 1. Update Domain Configurations

Edit `src/utils/domainConfig.js` and update the `DOMAIN_CONFIGS` object:

```javascript
const DOMAIN_CONFIGS = {
  // Your primary Vercel domain
  'your-app-primary.vercel.app': {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api-primary.example.com',
    STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_primary...',
    APP_NAME: 'Charity App - Primary',
    THEME_COLOR: '#3B82F6',
    // Add more configs as needed
  },
  
  // Your secondary domain
  'your-app-secondary.vercel.app': {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL_SECONDARY || 'https://api-secondary.example.com',
    STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY_SECONDARY || 'pk_test_secondary...',
    APP_NAME: 'Charity App - Secondary',
    THEME_COLOR: '#10B981',
  },
  
  // Custom domain
  'custom-domain.com': {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL_CUSTOM || 'https://api-custom.example.com',
    STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY_CUSTOM || 'pk_live_custom...',
    APP_NAME: 'Custom Charity Organization',
    THEME_COLOR: '#EF4444',
  }
};
```

### 2. Set Environment Variables in Vercel

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add these variables:

```bash
# Primary domain variables
NEXT_PUBLIC_API_URL=https://api-primary.example.com
NEXT_PUBLIC_STRIPE_KEY=pk_test_primary_key

# Secondary domain variables  
NEXT_PUBLIC_API_URL_SECONDARY=https://api-secondary.example.com
NEXT_PUBLIC_STRIPE_KEY_SECONDARY=pk_test_secondary_key

# Custom domain variables
NEXT_PUBLIC_API_URL_CUSTOM=https://api-custom.example.com
NEXT_PUBLIC_STRIPE_KEY_CUSTOM=pk_live_custom_key
```

### 3. Add Domains in Vercel

1. Go to your project settings
2. Navigate to "Domains"
3. Add your domains:
   - `your-app-secondary.vercel.app`
   - `custom-domain.com`

## 🚀 Usage Examples

### 1. Basic Usage - Get Current Config

```javascript
import { getDomainConfig } from '@/utils/domainConfig';

const config = getDomainConfig();
console.log(config.API_BASE_URL); // Different URL based on domain
console.log(config.APP_NAME);     // Different name based on domain
```

### 2. Get Specific Config Value

```javascript
import { getConfigValue } from '@/utils/domainConfig';

const apiUrl = getConfigValue('API_BASE_URL');
const appName = getConfigValue('APP_NAME');
```

### 3. React Hook Usage

```javascript
import { useDomainConfig } from '@/utils/domainConfig';

function MyComponent() {
  const config = useDomainConfig();
  
  return (
    <div style={{ color: config.THEME_COLOR }}>
      <h1>{config.APP_NAME}</h1>
    </div>
  );
}
```

### 4. Conditional Logic Based on Domain

```javascript
import { isDomain } from '@/utils/domainConfig';

if (isDomain('custom-domain.com')) {
  // Custom domain specific logic
  console.log('Running on custom domain');
}
```

### 5. API Service Integration

The API service automatically uses the domain-based configuration:

```javascript
// This now automatically uses the correct API URL based on domain
import { apiService } from '@/api/services/app/apiService';

const events = await apiService.get('/events');
```

## 🔧 Advanced Configuration

### Adding New Configuration Keys

To add new configuration options:

1. Update `DOMAIN_CONFIGS` in `domainConfig.js`:

```javascript
const DOMAIN_CONFIGS = {
  'your-domain.com': {
    API_BASE_URL: '...',
    STRIPE_PUBLIC_KEY: '...',
    // Add new configs
    GOOGLE_ANALYTICS_ID: 'GA-XXXXX',
    FACEBOOK_PIXEL_ID: 'FB-XXXXX',
    CUSTOM_LOGO_URL: 'https://...',
    PAYMENT_METHODS: ['stripe', 'paypal'],
    FEATURE_FLAGS: {
      enableNewFeature: true,
      showBetaFeatures: false
    }
  }
};
```

2. Use them in your components:

```javascript
const config = getDomainConfig();
const analyticsId = config.GOOGLE_ANALYTICS_ID;
const logoUrl = config.CUSTOM_LOGO_URL;
```

### Server-Side Usage

For server-side rendering or API routes:

```javascript
// In getServerSideProps or API routes
import { getDomainConfig } from '@/utils/domainConfig';

export async function getServerSideProps({ req }) {
  const domain = req.headers.host;
  const config = getDomainConfig(domain);
  
  return {
    props: {
      config
    }
  };
}
```

## 🎨 Styling Based on Domain

You can use domain-specific themes:

```javascript
// In your main layout or theme provider
import { getDomainConfig } from '@/utils/domainConfig';

function Layout({ children }) {
  const config = getDomainConfig();
  
  return (
    <div style={{ '--primary-color': config.THEME_COLOR }}>
      <header>
        <h1>{config.APP_NAME}</h1>
      </header>
      {children}
    </div>
  );
}
```

## 🛠️ Testing

### Local Testing

```javascript
// Test different domains locally
const testConfig = getDomainConfig('custom-domain.com');
console.log(testConfig);
```

### Preview Deployments

Vercel preview deployments will use the default configuration unless you specify a domain match.

## 📝 Notes

1. **Fallback**: If no domain matches, the `DEFAULT_CONFIG` is used
2. **Environment Variables**: Still use environment variables for sensitive data
3. **Caching**: Configurations are determined at runtime
4. **Performance**: Minimal impact as domain detection is cached
5. **Security**: Never expose sensitive keys in the domain config

## 🔍 Troubleshooting

### Issue: Wrong configuration being used
- Check domain spelling in `DOMAIN_CONFIGS`
- Verify domain is correctly added in Vercel
- Check browser developer tools for actual domain

### Issue: Environment variables not working
- Ensure variables are set in Vercel dashboard
- Check variable names match exactly
- Redeploy after adding new variables

### Issue: Server-side vs Client-side mismatch
- Use the same domain detection logic on both sides
- Consider hydration issues with SSR

## 🎯 Benefits

✅ **Single Codebase**: One repository for multiple domains
✅ **Easy Management**: All configs in one place
✅ **Environment Separation**: Different APIs/keys per domain
✅ **Flexible**: Add new domains without code changes
✅ **Scalable**: Works with unlimited domains
✅ **Type-Safe**: Full TypeScript support