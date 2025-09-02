// Google Ads API Integration
export class GoogleAdsService {
  private static readonly BASE_URL = 'https://googleads.googleapis.com/v14';
  private static accessToken: string | null = null;
  private static customerId: string | null = null;

  static setCredentials(accessToken: string, customerId: string) {
    this.accessToken = accessToken;
    this.customerId = customerId;
  }

  static async getCustomers() {
    if (!this.accessToken) {
      throw new Error('Google Ads access token not set');
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/customers:listAccessibleCustomers`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Google Ads API error: ${response.status}`);
      }

      const data = await response.json();
      return data.resourceNames || [];
    } catch (error) {
      console.error('Error fetching Google Ads customers:', error);
      throw error;
    }
  }

  static async getCampaigns() {
    if (!this.accessToken || !this.customerId) {
      throw new Error('Google Ads credentials not set');
    }

    try {
      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type,
          campaign.start_date,
          campaign.end_date,
          campaign.campaign_budget
        FROM campaign
        WHERE campaign.status != 'REMOVED'
        ORDER BY campaign.name
      `;

      const response = await fetch(
        `${this.BASE_URL}/customers/${this.customerId}/googleAds:search`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Google Ads API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching Google Ads campaigns:', error);
      throw error;
    }
  }

  static async getCampaignMetrics(campaignId: string, dateRange: { startDate: string; endDate: string }) {
    if (!this.accessToken || !this.customerId) {
      throw new Error('Google Ads credentials not set');
    }

    try {
      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          metrics.impressions,
          metrics.clicks,
          metrics.ctr,
          metrics.average_cpc,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversion_rate,
          segments.date
        FROM campaign
        WHERE campaign.id = ${campaignId}
        AND segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
        ORDER BY segments.date
      `;

      const response = await fetch(
        `${this.BASE_URL}/customers/${this.customerId}/googleAds:search`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Google Ads API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching Google Ads campaign metrics:', error);
      throw error;
    }
  }

  static async createCampaign(campaignData: {
    name: string;
    advertisingChannelType: string;
    status: string;
    budgetId: string;
    startDate?: string;
    endDate?: string;
  }) {
    if (!this.accessToken || !this.customerId) {
      throw new Error('Google Ads credentials not set');
    }

    try {
      const operations = [{
        create: {
          name: campaignData.name,
          advertisingChannelType: campaignData.advertisingChannelType,
          status: campaignData.status,
          campaignBudget: `customers/${this.customerId}/campaignBudgets/${campaignData.budgetId}`,
          ...(campaignData.startDate && { startDate: campaignData.startDate }),
          ...(campaignData.endDate && { endDate: campaignData.endDate })
        }
      }];

      const response = await fetch(
        `${this.BASE_URL}/customers/${this.customerId}/campaigns:mutate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ operations })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Google Ads API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results[0];
    } catch (error) {
      console.error('Error creating Google Ads campaign:', error);
      throw error;
    }
  }

  static async updateCampaignStatus(campaignId: string, status: 'ENABLED' | 'PAUSED' | 'REMOVED') {
    if (!this.accessToken || !this.customerId) {
      throw new Error('Google Ads credentials not set');
    }

    try {
      const operations = [{
        update: {
          resourceName: `customers/${this.customerId}/campaigns/${campaignId}`,
          status: status
        },
        updateMask: 'status'
      }];

      const response = await fetch(
        `${this.BASE_URL}/customers/${this.customerId}/campaigns:mutate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ operations })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Google Ads API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results[0];
    } catch (error) {
      console.error('Error updating Google Ads campaign status:', error);
      throw error;
    }
  }
}
