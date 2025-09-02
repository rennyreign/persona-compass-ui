// Facebook Marketing API Integration
export class FacebookAdsService {
  private static readonly BASE_URL = 'https://graph.facebook.com/v18.0';
  private static accessToken: string | null = null;

  static setAccessToken(token: string) {
    this.accessToken = token;
  }

  static async getAdAccounts() {
    if (!this.accessToken) {
      throw new Error('Facebook access token not set');
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/me/adaccounts?fields=id,name,account_status,currency&access_token=${this.accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching Facebook ad accounts:', error);
      throw error;
    }
  }

  static async getCampaigns(adAccountId: string) {
    if (!this.accessToken) {
      throw new Error('Facebook access token not set');
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/${adAccountId}/campaigns?fields=id,name,status,objective,created_time,updated_time&access_token=${this.accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching Facebook campaigns:', error);
      throw error;
    }
  }

  static async getCampaignInsights(campaignId: string, dateRange: { since: string; until: string }) {
    if (!this.accessToken) {
      throw new Error('Facebook access token not set');
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/${campaignId}/insights?fields=impressions,clicks,ctr,cpm,cpp,spend,reach,frequency&time_range=${JSON.stringify(dateRange)}&access_token=${this.accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data[0] || null;
    } catch (error) {
      console.error('Error fetching Facebook campaign insights:', error);
      throw error;
    }
  }

  static async createCampaign(adAccountId: string, campaignData: {
    name: string;
    objective: string;
    status: string;
    special_ad_categories?: string[];
  }) {
    if (!this.accessToken) {
      throw new Error('Facebook access token not set');
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/${adAccountId}/campaigns`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...campaignData,
            access_token: this.accessToken
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating Facebook campaign:', error);
      throw error;
    }
  }

  static async updateCampaignStatus(campaignId: string, status: 'ACTIVE' | 'PAUSED' | 'DELETED') {
    if (!this.accessToken) {
      throw new Error('Facebook access token not set');
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/${campaignId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status,
            access_token: this.accessToken
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating Facebook campaign status:', error);
      throw error;
    }
  }
}
