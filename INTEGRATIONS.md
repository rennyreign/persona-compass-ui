# PersonaOps API Integrations

This document outlines the external API integrations implemented in PersonaOps for comprehensive marketing intelligence and automation.

## 🚀 **Completed Integrations**

### **1. Facebook Ads API Integration**
**File:** `/src/services/api/facebookAds.ts`

**Features:**
- Ad account management and retrieval
- Campaign creation, management, and status updates
- Campaign insights and performance metrics
- Real-time spend, impressions, clicks, and CTR tracking

**Key Methods:**
- `getAdAccounts()` - Retrieve user's ad accounts
- `getCampaigns(adAccountId)` - Get campaigns for specific account
- `getCampaignInsights(campaignId, dateRange)` - Performance metrics
- `createCampaign(adAccountId, campaignData)` - Create new campaigns
- `updateCampaignStatus(campaignId, status)` - Pause/activate campaigns

**Environment Variables:**
```
FACEBOOK_ACCESS_TOKEN=""
FACEBOOK_APP_ID=""
FACEBOOK_APP_SECRET=""
```

### **2. Google Ads API Integration**
**File:** `/src/services/api/googleAds.ts`

**Features:**
- Customer account access and management
- Campaign lifecycle management
- Advanced metrics and reporting
- Budget and bidding optimization

**Key Methods:**
- `getCustomers()` - List accessible customer accounts
- `getCampaigns()` - Retrieve campaigns with filtering
- `getCampaignMetrics(campaignId, dateRange)` - Detailed performance data
- `createCampaign(campaignData)` - Campaign creation with targeting
- `updateCampaignStatus(campaignId, status)` - Campaign control

**Environment Variables:**
```
GOOGLE_ADS_DEVELOPER_TOKEN=""
GOOGLE_ADS_CLIENT_ID=""
GOOGLE_ADS_CLIENT_SECRET=""
GOOGLE_ADS_REFRESH_TOKEN=""
```

### **3. HubSpot CRM Integration**
**File:** `/src/services/api/hubspot.ts`

**Features:**
- Contact and lead management
- Deal pipeline tracking
- Company data synchronization
- Persona-to-CRM mapping

**Key Methods:**
- `getContacts(limit, after)` - Retrieve contact records
- `createContact(contactData)` - Create new contacts
- `updateContact(contactId, updateData)` - Update contact information
- `getDeals(limit, after)` - Deal pipeline management
- `syncPersonaToHubSpot(personaData)` - Persona synchronization
- `trackCampaignLead(campaignId, personaId, leadData)` - Lead attribution

**Environment Variables:**
```
HUBSPOT_ACCESS_TOKEN=""
HUBSPOT_CLIENT_ID=""
HUBSPOT_CLIENT_SECRET=""
```

### **4. OpenAI DALL-E Integration**
**File:** `/src/services/openai.ts`

**Features:**
- AI-powered persona image generation
- Campaign creative generation
- Professional headshot creation
- Contextual prompt engineering

**Key Methods:**
- `generatePersonaImage(personaData)` - Create persona avatars
- `generateCampaignCreative(campaignData)` - Marketing visuals
- `setApiKey(key)` - API key configuration

**Environment Variables:**
```
OPENAI_API_KEY="your-key-here"
VITE_OPENAI_API_KEY="your-key-here"
```

## 🎨 **UI/UX Enhancements**

### **Admin Tools Page**
**Route:** `/admin`
**Features:**
- Bulk Persona Creator
- Persona Image Generator (OpenAI-powered)
- Bulk Campaign Creator
- Centralized administrative functions

### **Enhanced Notification System**
**Component:** `TopHeader.tsx`
**Features:**
- Real-time activity notifications
- Database-driven content
- Campaign and persona updates
- Smart notification icons and badges

### **Attribution Page Improvements**
**Component:** `PersonaAttributionTracking.tsx`
**Features:**
- Individual persona performance cards
- Campaign attribution metrics
- Effectiveness scoring
- Database-driven insights

### **Sidebar Cleanup**
**Component:** `Sidebar.tsx`
**Features:**
- Dynamic user information
- Removed hardcoded placeholder data
- Clean navigation structure

## 🗄️ **Database Integration**

### **Mock Data Removal**
- Deprecated `/src/data/mockData.ts`
- All components now use Supabase queries
- Real-time data synchronization
- Performance metrics from database

### **Notification System**
- Campaign creation notifications
- Persona activity tracking
- Real-time updates
- User-specific content

## 🔧 **Setup Instructions**

### **1. Environment Configuration**
Copy the environment variables from `.env` and fill in your API credentials:

```bash
# Facebook Ads
FACEBOOK_ACCESS_TOKEN="your-facebook-token"
FACEBOOK_APP_ID="your-app-id"
FACEBOOK_APP_SECRET="your-app-secret"

# Google Ads
GOOGLE_ADS_DEVELOPER_TOKEN="your-developer-token"
GOOGLE_ADS_CLIENT_ID="your-client-id"
GOOGLE_ADS_CLIENT_SECRET="your-client-secret"
GOOGLE_ADS_REFRESH_TOKEN="your-refresh-token"

# HubSpot
HUBSPOT_ACCESS_TOKEN="your-hubspot-token"
HUBSPOT_CLIENT_ID="your-client-id"
HUBSPOT_CLIENT_SECRET="your-client-secret"
```

### **2. API Service Usage**

```typescript
// Facebook Ads Example
import { FacebookAdsService } from '@/services/api/facebookAds';

FacebookAdsService.setAccessToken(process.env.FACEBOOK_ACCESS_TOKEN);
const campaigns = await FacebookAdsService.getCampaigns(adAccountId);

// Google Ads Example
import { GoogleAdsService } from '@/services/api/googleAds';

GoogleAdsService.setCredentials(accessToken, customerId);
const metrics = await GoogleAdsService.getCampaignMetrics(campaignId, dateRange);

// HubSpot Example
import { HubSpotService } from '@/services/api/hubspot';

HubSpotService.setAccessToken(process.env.HUBSPOT_ACCESS_TOKEN);
const contacts = await HubSpotService.getContacts();

// OpenAI Example
import { OpenAIService } from '@/services/openai';

OpenAIService.setApiKey(process.env.OPENAI_API_KEY);
const imageUrl = await OpenAIService.generatePersonaImage(personaData);
```

### **3. Component Integration**

All API services are designed to work seamlessly with existing PersonaOps components:

- **Campaign Management:** Automatic sync with Facebook and Google Ads
- **Lead Tracking:** HubSpot integration for attribution
- **Image Generation:** OpenAI-powered persona avatars
- **Real-time Updates:** Database-driven notifications and metrics

## 🔒 **Security Considerations**

- API keys stored in environment variables
- Client-side API calls use secure tokens
- Fallback mechanisms for API failures
- Error handling and logging implemented

## 📈 **Performance Features**

- Async API calls with proper error handling
- Caching mechanisms for repeated requests
- Fallback to placeholder data when APIs unavailable
- Rate limiting considerations built-in

## 🚀 **Next Steps**

1. **API Key Configuration:** Add your actual API credentials to `.env`
2. **Testing:** Verify each integration with your accounts
3. **Customization:** Adjust API calls based on your specific needs
4. **Monitoring:** Implement logging and analytics for API usage

---

**PersonaOps** - AI-First Marketing Intelligence Platform
Built with React, TypeScript, Tailwind CSS, and Supabase
