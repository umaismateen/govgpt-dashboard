export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      chat: {
        Row: {
          created_at: string
          id: string
          saved_id: number | null
          type: Database["public"]["Enums"]["chat_type"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          saved_id?: number | null
          type?: Database["public"]["Enums"]["chat_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          saved_id?: number | null
          type?: Database["public"]["Enums"]["chat_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_saved_id_fkey"
            columns: ["saved_id"]
            isOneToOne: true
            referencedRelation: "saved_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      enterprise_waitlist: {
        Row: {
          additionalInfo: string | null
          companySize: string | null
          created_at: string
          email: string | null
          id: number
          industry: string | null
          name: string | null
        }
        Insert: {
          additionalInfo?: string | null
          companySize?: string | null
          created_at?: string
          email?: string | null
          id?: number
          industry?: string | null
          name?: string | null
        }
        Update: {
          additionalInfo?: string | null
          companySize?: string | null
          created_at?: string
          email?: string | null
          id?: number
          industry?: string | null
          name?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string | null
          content: string | null
          created_at: string
          id: number
          role: string | null
          user_id: string | null
        }
        Insert: {
          chat_id?: string | null
          content?: string | null
          created_at?: string
          id?: number
          role?: string | null
          user_id?: string | null
        }
        Update: {
          chat_id?: string | null
          content?: string | null
          created_at?: string
          id?: number
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      naic_codes: {
        Row: {
          code: number
          created_at: string
          id: number
          label: string
          naic_codes: string
        }
        Insert: {
          code: number
          created_at?: string
          id?: number
          label: string
          naic_codes: string
        }
        Update: {
          code?: number
          created_at?: string
          id?: number
          label?: string
          naic_codes?: string
        }
        Relationships: []
      }
      outline_sub_sections: {
        Row: {
          created_at: string
          id: number
          order: number | null
          outline_id: number
          promt: string
          title: string
        }
        Insert: {
          created_at?: string
          id: number
          order?: number | null
          outline_id: number
          promt: string
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          order?: number | null
          outline_id?: number
          promt?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "outline_sub_sections_outline_id_fkey"
            columns: ["outline_id"]
            isOneToOne: false
            referencedRelation: "proposal_outlines"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_service_codes: {
        Row: {
          code: string
          id: number
          label: string
          product_service_codes: string
        }
        Insert: {
          code: string
          id?: number
          label: string
          product_service_codes: string
        }
        Update: {
          code?: string
          id?: number
          label?: string
          product_service_codes?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      proposal_outlines: {
        Row: {
          created_at: string
          id: number
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      proposal_prompts: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: number
          prompt: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: number
          prompt?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: number
          prompt?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          contract_name: string | null
          contract_notice_id: string
          created_at: string
          id: string
          name: string | null
          proposal: string | null
          user_id: string
        }
        Insert: {
          contract_name?: string | null
          contract_notice_id: string
          created_at?: string
          id?: string
          name?: string | null
          proposal?: string | null
          user_id?: string
        }
        Update: {
          contract_name?: string | null
          contract_notice_id?: string
          created_at?: string
          id?: string
          name?: string | null
          proposal?: string | null
          user_id?: string
        }
        Relationships: []
      }
      query_usage: {
        Row: {
          created_at: string
          id: number
          month: number
          query_count: number | null
          updated_at: string | null
          user_id: string | null
          year: number
        }
        Insert: {
          created_at?: string
          id?: number
          month: number
          query_count?: number | null
          updated_at?: string | null
          user_id?: string | null
          year: number
        }
        Update: {
          created_at?: string
          id?: number
          month?: number
          query_count?: number | null
          updated_at?: string | null
          user_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "query_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_contracts: {
        Row: {
          created_at: string
          id: number
          name: string | null
          notice_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          notice_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          notice_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_contracts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_alerts: {
        Row: {
          created_at: string
          id: number
          interval: Database["public"]["Enums"]["alerts_interval"] | null
          last_send_at: string | null
          query: string
          recipientEmails: string[]
          status: Database["public"]["Enums"]["alert_status"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          interval?: Database["public"]["Enums"]["alerts_interval"] | null
          last_send_at?: string | null
          query: string
          recipientEmails: string[]
          status?: Database["public"]["Enums"]["alert_status"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          interval?: Database["public"]["Enums"]["alerts_interval"] | null
          last_send_at?: string | null
          query?: string
          recipientEmails?: string[]
          status?: Database["public"]["Enums"]["alert_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "smart_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: []
      }
      support_form: {
        Row: {
          created_at: string
          email: string
          id: number
          message: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          message: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          message?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_form_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      total_usage: {
        Row: {
          alerts: number | null
          created_at: string
          finder: number | null
          id: number
          proposals: number | null
          saved: number | null
          user_id: string
        }
        Insert: {
          alerts?: number | null
          created_at?: string
          finder?: number | null
          id?: number
          proposals?: number | null
          saved?: number | null
          user_id?: string
        }
        Update: {
          alerts?: number | null
          created_at?: string
          finder?: number | null
          id?: number
          proposals?: number | null
          saved?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "total_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          accepted_terms: boolean | null
          additional_info: string | null
          address: string | null
          avatar_url: string | null
          billing_address: Json | null
          cageId: string | null
          chatbot_queries: number | null
          created_at: string | null
          experience: number | null
          finder_queries: number | null
          fingerprint: string | null
          full_name: string | null
          id: string
          Industry: string | null
          is_new_user: boolean | null
          organization: string | null
          payment_method: Json | null
          person_of_contact: string | null
          phone_number: string | null
          proposal_writer_queries: number | null
          smart_alert_queries: number | null
        }
        Insert: {
          accepted_terms?: boolean | null
          additional_info?: string | null
          address?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          cageId?: string | null
          chatbot_queries?: number | null
          created_at?: string | null
          experience?: number | null
          finder_queries?: number | null
          fingerprint?: string | null
          full_name?: string | null
          id: string
          Industry?: string | null
          is_new_user?: boolean | null
          organization?: string | null
          payment_method?: Json | null
          person_of_contact?: string | null
          phone_number?: string | null
          proposal_writer_queries?: number | null
          smart_alert_queries?: number | null
        }
        Update: {
          accepted_terms?: boolean | null
          additional_info?: string | null
          address?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          cageId?: string | null
          chatbot_queries?: number | null
          created_at?: string | null
          experience?: number | null
          finder_queries?: number | null
          fingerprint?: string | null
          full_name?: string | null
          id?: string
          Industry?: string | null
          is_new_user?: boolean | null
          organization?: string | null
          payment_method?: Json | null
          person_of_contact?: string | null
          phone_number?: string | null
          proposal_writer_queries?: number | null
          smart_alert_queries?: number | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string | null
          id: number
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_monthly_query_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          month_name: string
          year: number
          total_queries: number
        }[]
      }
      get_user_data_with_subscription_and_usage: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          created_at: string
          email: string
          phone_number: string
          full_name: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          contracts_found: number
          alerts_set: number
          saved_contracts: number
          isontrial: boolean
        }[]
      }
    }
    Enums: {
      alert_status: "active" | "paused"
      alerts_interval: "daily" | "weekly" | "monthly"
      chat_type: "finder"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
