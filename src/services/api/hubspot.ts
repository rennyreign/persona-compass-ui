// HubSpot CRM API Integration
export class HubSpotService {
  private static readonly BASE_URL = 'https://api.hubapi.com';
  private static accessToken: string | null = null;

  static setAccessToken(token: string) {
    this.accessToken = token;
  }

  static async getContacts(limit: number = 100, after?: string) {
    if (!this.accessToken) {
      throw new Error('HubSpot access token not set');
    }

    try {
      let url = `${this.BASE_URL}/crm/v3/objects/contacts?limit=${limit}&properties=firstname,lastname,email,phone,company,lifecyclestage,createdate,lastmodifieddate`;
      if (after) {
        url += `&after=${after}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching HubSpot contacts:', error);
      throw error;
    }
  }

  static async createContact(contactData: {
    firstname?: string;
    lastname?: string;
    email: string;
    phone?: string;
    company?: string;
    lifecyclestage?: string;
    persona_id?: string;
    campaign_source?: string;
  }) {
    if (!this.accessToken) {
      throw new Error('HubSpot access token not set');
    }

    try {
      const response = await fetch(`${this.BASE_URL}/crm/v3/objects/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: contactData
        })
      });
      
      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating HubSpot contact:', error);
      throw error;
    }
  }

  static async updateContact(contactId: string, updateData: Record<string, any>) {
    if (!this.accessToken) {
      throw new Error('HubSpot access token not set');
    }

    try {
      const response = await fetch(`${this.BASE_URL}/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: updateData
        })
      });
      
      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating HubSpot contact:', error);
      throw error;
    }
  }

  static async getDeals(limit: number = 100, after?: string) {
    if (!this.accessToken) {
      throw new Error('HubSpot access token not set');
    }

    try {
      let url = `${this.BASE_URL}/crm/v3/objects/deals?limit=${limit}&properties=dealname,amount,dealstage,pipeline,closedate,createdate,hubspot_owner_id`;
      if (after) {
        url += `&after=${after}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching HubSpot deals:', error);
      throw error;
    }
  }

  static async createDeal(dealData: {
    dealname: string;
    amount?: number;
    dealstage: string;
    pipeline?: string;
    closedate?: string;
    persona_id?: string;
    campaign_source?: string;
  }) {
    if (!this.accessToken) {
      throw new Error('HubSpot access token not set');
    }

    try {
      const response = await fetch(`${this.BASE_URL}/crm/v3/objects/deals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: dealData
        })
      });
      
      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating HubSpot deal:', error);
      throw error;
    }
  }

  static async getCompanies(limit: number = 100, after?: string) {
    if (!this.accessToken) {
      throw new Error('HubSpot access token not set');
    }

    try {
      let url = `${this.BASE_URL}/crm/v3/objects/companies?limit=${limit}&properties=name,domain,industry,city,state,country,numberofemployees,annualrevenue`;
      if (after) {
        url += `&after=${after}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching HubSpot companies:', error);
      throw error;
    }
  }

  static async syncPersonaToHubSpot(personaData: {
    id: string;
    name: string;
    email?: string;
    occupation?: string;
    program_category?: string;
    organization?: string;
  }) {
    // Create or update contact with persona information
    const contactData = {
      firstname: personaData.name.split(' ')[0],
      lastname: personaData.name.split(' ').slice(1).join(' ') || '',
      email: personaData.email || `${personaData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      company: personaData.organization || '',
      lifecyclestage: 'lead',
      persona_id: personaData.id,
      job_title: personaData.occupation || '',
      program_interest: personaData.program_category || ''
    };

    return this.createContact(contactData);
  }

  static async trackCampaignLead(campaignId: string, personaId: string, leadData: {
    email: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
  }) {
    const contactData = {
      ...leadData,
      lifecyclestage: 'lead',
      persona_id: personaId,
      campaign_source: campaignId,
      lead_source: 'PersonaOps Campaign'
    };

    return this.createContact(contactData);
  }
}
