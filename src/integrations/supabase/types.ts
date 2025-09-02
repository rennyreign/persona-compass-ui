export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ab_experiments: {
        Row: {
          confidence_level: number | null
          created_at: string
          description: string | null
          end_date: string | null
          hypothesis: string | null
          id: string
          name: string
          organization_id: string | null
          persona_id: string
          results: Json | null
          sample_size_target: number | null
          start_date: string | null
          statistical_significance: boolean | null
          status: string | null
          test_metric: string
          updated_at: string
          user_id: string
          variant_a_description: string
          variant_b_description: string
          winner_variant: string | null
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          hypothesis?: string | null
          id?: string
          name: string
          organization_id?: string | null
          persona_id: string
          results?: Json | null
          sample_size_target?: number | null
          start_date?: string | null
          statistical_significance?: boolean | null
          status?: string | null
          test_metric: string
          updated_at?: string
          user_id: string
          variant_a_description: string
          variant_b_description: string
          winner_variant?: string | null
        }
        Update: {
          confidence_level?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          hypothesis?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          persona_id?: string
          results?: Json | null
          sample_size_target?: number | null
          start_date?: string | null
          statistical_significance?: boolean | null
          status?: string | null
          test_metric?: string
          updated_at?: string
          user_id?: string
          variant_a_description?: string
          variant_b_description?: string
          winner_variant?: string | null
        }
        Relationships: []
      }
      campaign_performance: {
        Row: {
          campaign_id: string
          clicks: number | null
          conversion_rate: number | null
          conversions: number | null
          cpc: number | null
          cpm: number | null
          created_at: string
          ctr: number | null
          date: string
          id: string
          impressions: number | null
          organization_id: string | null
          roas: number | null
          spend: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          clicks?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string
          ctr?: number | null
          date: string
          id?: string
          impressions?: number | null
          organization_id?: string | null
          roas?: number | null
          spend?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          clicks?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          cpc?: number | null
          cpm?: number | null
          created_at?: string
          ctr?: number | null
          date?: string
          id?: string
          impressions?: number | null
          organization_id?: string | null
          roas?: number | null
          spend?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_performance_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_performance_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          attribution_score: number | null
          budget: number | null
          campaign_type: string | null
          channels: string[] | null
          created_at: string
          creative_assets: string[] | null
          description: string | null
          end_date: string | null
          expected_cpl: number | null
          expected_ctr: number | null
          experiment_id: string | null
          experiment_variant: string | null
          id: string
          messaging_variant: string | null
          objectives: string[] | null
          organization_id: string | null
          persona_id: string
          persona_traits_tested: string[] | null
          start_date: string | null
          status: string | null
          target_metrics: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attribution_score?: number | null
          budget?: number | null
          campaign_type?: string | null
          channels?: string[] | null
          created_at?: string
          creative_assets?: string[] | null
          description?: string | null
          end_date?: string | null
          expected_cpl?: number | null
          expected_ctr?: number | null
          experiment_id?: string | null
          experiment_variant?: string | null
          id?: string
          messaging_variant?: string | null
          objectives?: string[] | null
          organization_id?: string | null
          persona_id: string
          persona_traits_tested?: string[] | null
          start_date?: string | null
          status?: string | null
          target_metrics?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attribution_score?: number | null
          budget?: number | null
          campaign_type?: string | null
          channels?: string[] | null
          created_at?: string
          creative_assets?: string[] | null
          description?: string | null
          end_date?: string | null
          expected_cpl?: number | null
          expected_ctr?: number | null
          experiment_id?: string | null
          experiment_variant?: string | null
          id?: string
          messaging_variant?: string | null
          objectives?: string[] | null
          organization_id?: string | null
          persona_id?: string
          persona_traits_tested?: string[] | null
          start_date?: string | null
          status?: string | null
          target_metrics?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      insights: {
        Row: {
          content: string
          created_at: string | null
          generated_at: string | null
          id: string
          is_gpt_generated: boolean | null
          organization_id: string | null
          persona_id: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          generated_at?: string | null
          id?: string
          is_gpt_generated?: boolean | null
          organization_id?: string | null
          persona_id: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          generated_at?: string | null
          id?: string
          is_gpt_generated?: boolean | null
          organization_id?: string | null
          persona_id?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insights_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          settings: Json | null
          subdomain: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          settings?: Json | null
          subdomain?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          settings?: Json | null
          subdomain?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      persona_performance_tracking: {
        Row: {
          avg_cpl: number | null
          avg_ctr: number | null
          campaign_count: number | null
          conversion_rate: number | null
          cost_efficiency: number | null
          created_at: string
          date: string
          effectiveness_score: number | null
          id: string
          organization_id: string | null
          persona_id: string
          roi_score: number | null
          total_leads: number | null
          total_spend: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_cpl?: number | null
          avg_ctr?: number | null
          campaign_count?: number | null
          conversion_rate?: number | null
          cost_efficiency?: number | null
          created_at?: string
          date?: string
          effectiveness_score?: number | null
          id?: string
          organization_id?: string | null
          persona_id: string
          roi_score?: number | null
          total_leads?: number | null
          total_spend?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_cpl?: number | null
          avg_ctr?: number | null
          campaign_count?: number | null
          conversion_rate?: number | null
          cost_efficiency?: number | null
          created_at?: string
          date?: string
          effectiveness_score?: number | null
          id?: string
          organization_id?: string | null
          persona_id?: string
          roi_score?: number | null
          total_leads?: number | null
          total_spend?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      personas: {
        Row: {
          age_range: string | null
          avatar_url: string | null
          created_at: string
          description: string | null
          education_level: string | null
          goals: string[] | null
          id: string
          income_range: string | null
          industry: string | null
          location: string | null
          name: string
          occupation: string | null
          organization_id: string | null
          pain_points: string[] | null
          personality_traits: string[] | null
          preferred_channels: string[] | null
          program_category: string | null
          status: string | null
          updated_at: string
          user_id: string
          values: string[] | null
          visual_identity_images: string[] | null
        }
        Insert: {
          age_range?: string | null
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          education_level?: string | null
          goals?: string[] | null
          id?: string
          income_range?: string | null
          industry?: string | null
          location?: string | null
          name: string
          occupation?: string | null
          organization_id?: string | null
          pain_points?: string[] | null
          personality_traits?: string[] | null
          preferred_channels?: string[] | null
          program_category?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          values?: string[] | null
          visual_identity_images?: string[] | null
        }
        Update: {
          age_range?: string | null
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          education_level?: string | null
          goals?: string[] | null
          id?: string
          income_range?: string | null
          industry?: string | null
          location?: string | null
          name?: string
          occupation?: string | null
          organization_id?: string | null
          pain_points?: string[] | null
          personality_traits?: string[] | null
          preferred_channels?: string[] | null
          program_category?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          values?: string[] | null
          visual_identity_images?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "personas_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          key_benefits: string[] | null
          name: string
          organization_id: string | null
          target_audience: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          key_benefits?: string[] | null
          name: string
          organization_id?: string | null
          target_audience?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          key_benefits?: string[] | null
          name?: string
          organization_id?: string | null
          target_audience?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          organization_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          organization_id: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id?: string | null
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_persona_effectiveness: {
        Args: { _end_date?: string; _persona_id: string; _start_date?: string }
        Returns: number
      }
      can_manage_personas_in_org: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      can_view_persona: {
        Args: { _persona_id: string; _user_id: string }
        Returns: boolean
      }
      check_user_role: {
        Args: { _role: string; _user_id: string }
        Returns: boolean
      }
      get_programs_for_organization: {
        Args: { org_id: string }
        Returns: {
          category: string
          description: string
          id: string
          key_benefits: string[]
          name: string
          target_audience: string
        }[]
      }
      get_user_organization_role: {
        Args: Record<PropertyKey, never>
        Returns: {
          organization_id: string
          organization_name: string
          role: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
