export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      competition_fields: {
        Row: {
          competition_id: string
          created_at: string
          field_type: Database["public"]["Enums"]["field_type"]
          id: string
          key: string
          label: string
          options: Json | null
          placeholder: string | null
          position: number
          required: boolean
        }
        Insert: {
          competition_id: string
          created_at?: string
          field_type?: Database["public"]["Enums"]["field_type"]
          id?: string
          key: string
          label: string
          options?: Json | null
          placeholder?: string | null
          position?: number
          required?: boolean
        }
        Update: {
          competition_id?: string
          created_at?: string
          field_type?: Database["public"]["Enums"]["field_type"]
          id?: string
          key?: string
          label?: string
          options?: Json | null
          placeholder?: string | null
          position?: number
          required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "competition_fields_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          accent: string | null
          created_at: string
          description: string | null
          fee_idr: number
          icon: string | null
          id: string
          is_open: boolean
          name: string
          position: number
          prize: string | null
          quota: number
          rules: Json
          slug: string
          tagline: string | null
          team_size: string | null
          timeline: Json
          updated_at: string
        }
        Insert: {
          accent?: string | null
          created_at?: string
          description?: string | null
          fee_idr?: number
          icon?: string | null
          id?: string
          is_open?: boolean
          name: string
          position?: number
          prize?: string | null
          quota?: number
          rules?: Json
          slug: string
          tagline?: string | null
          team_size?: string | null
          timeline?: Json
          updated_at?: string
        }
        Update: {
          accent?: string | null
          created_at?: string
          description?: string | null
          fee_idr?: number
          icon?: string | null
          id?: string
          is_open?: boolean
          name?: string
          position?: number
          prize?: string | null
          quota?: number
          rules?: Json
          slug?: string
          tagline?: string | null
          team_size?: string | null
          timeline?: Json
          updated_at?: string
        }
        Relationships: []
      }
      export_logs: {
        Row: {
          admin_id: string
          created_at: string
          export_type: string
          filters: Json | null
          id: string
          row_count: number | null
        }
        Insert: {
          admin_id: string
          created_at?: string
          export_type: string
          filters?: Json | null
          id?: string
          row_count?: number | null
        }
        Update: {
          admin_id?: string
          created_at?: string
          export_type?: string
          filters?: Json | null
          id?: string
          row_count?: number | null
        }
        Relationships: []
      }
      group_links: {
        Row: {
          competition_id: string
          created_at: string
          id: string
          link_url: string
          qr_url: string | null
          updated_at: string
        }
        Insert: {
          competition_id: string
          created_at?: string
          id?: string
          link_url: string
          qr_url?: string | null
          updated_at?: string
        }
        Update: {
          competition_id?: string
          created_at?: string
          id?: string
          link_url?: string
          qr_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_links_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: true
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      media_partners: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          position: number
          website: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          position?: number
          website?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          position?: number
          website?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_idr: number
          created_at: string
          id: string
          midtrans_order_id: string | null
          midtrans_payment_type: string | null
          midtrans_token: string | null
          midtrans_transaction_status: string | null
          paid_at: string | null
          registration_id: string
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_idr: number
          created_at?: string
          id?: string
          midtrans_order_id?: string | null
          midtrans_payment_type?: string | null
          midtrans_token?: string | null
          midtrans_transaction_status?: string | null
          paid_at?: string | null
          registration_id: string
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_idr?: number
          created_at?: string
          id?: string
          midtrans_order_id?: string | null
          midtrans_payment_type?: string | null
          midtrans_token?: string | null
          midtrans_transaction_status?: string | null
          paid_at?: string | null
          registration_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: true
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          institution: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          institution?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          institution?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      registration_answers: {
        Row: {
          created_at: string
          field_id: string | null
          field_key: string
          field_label: string | null
          id: string
          registration_id: string
          value: string | null
        }
        Insert: {
          created_at?: string
          field_id?: string | null
          field_key: string
          field_label?: string | null
          id?: string
          registration_id: string
          value?: string | null
        }
        Update: {
          created_at?: string
          field_id?: string | null
          field_key?: string
          field_label?: string | null
          id?: string
          registration_id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registration_answers_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "competition_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registration_answers_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          competition_id: string
          created_at: string
          id: string
          leader_email: string | null
          leader_name: string
          leader_whatsapp: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["registration_status"]
          team_name: string
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          competition_id: string
          created_at?: string
          id?: string
          leader_email?: string | null
          leader_name: string
          leader_whatsapp: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          team_name: string
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          competition_id?: string
          created_at?: string
          id?: string
          leader_email?: string | null
          leader_name?: string
          leader_whatsapp?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          team_name?: string
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      seminars: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          scheduled_at: string | null
          slug: string
          speaker: string | null
          status: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          scheduled_at?: string | null
          slug: string
          speaker?: string | null
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          scheduled_at?: string | null
          slug?: string
          speaker?: string | null
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          position: number
          tier: string | null
          website: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          position?: number
          tier?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          position?: number
          tier?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      field_type:
        | "text"
        | "textarea"
        | "number"
        | "email"
        | "tel"
        | "url"
        | "select"
        | "file"
      payment_status: "pending" | "success" | "failed" | "expired" | "refunded"
      publish_status: "draft" | "published"
      registration_status:
        | "draft"
        | "pending_payment"
        | "pending_verification"
        | "verified"
        | "rejected"
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
    Enums: {
      app_role: ["admin", "user"],
      field_type: [
        "text",
        "textarea",
        "number",
        "email",
        "tel",
        "url",
        "select",
        "file",
      ],
      payment_status: ["pending", "success", "failed", "expired", "refunded"],
      publish_status: ["draft", "published"],
      registration_status: [
        "draft",
        "pending_payment",
        "pending_verification",
        "verified",
        "rejected",
      ],
    },
  },
} as const
