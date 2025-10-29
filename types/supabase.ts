
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      match_events: {
        Row: {
          by_player: string
          created_at: string
          id: string
          match_id: string
          payload: Json | null
          type: Database["public"]["Enums"]["event_type"]
        }
        Insert: {
          by_player: string
          created_at?: string
          id?: string
          match_id: string
          payload?: Json | null
          type: Database["public"]["Enums"]["event_type"]
        }
        Update: {
          by_player?: string
          created_at?: string
          id?: string
          match_id?: string
          payload?: Json | null
          type?: Database["public"]["Enums"]["event_type"]
        }
        Relationships: [
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          best_of: number
          id: string
          legs_a: number
          legs_b: number
          lock_at: string
          player_a_id: string
          player_b_id: string
          round: string | null
          sets_a: number
          sets_b: number
          started_at: string | null
          tournament: string | null
        }
        Insert: {
          best_of: number
          id?: string
          legs_a?: number
          legs_b?: number
          lock_at: string
          player_a_id: string
          player_b_id: string
          round?: string | null
          sets_a?: number
          sets_b?: number
          started_at?: string | null
          tournament?: string | null
        }
        Update: {
          best_of?: number
          id?: string
          legs_a?: number
          legs_b?: number
          lock_at?: string
          player_a_id?: string
          player_b_id?: string
          round?: string | null
          sets_a?: number
          sets_b?: number
          started_at?: string | null
          tournament?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_player_a_id_fkey"
            columns: ["player_a_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player_b_id_fkey"
            columns: ["player_b_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      oom: {
        Row: {
          country_code: string
          player_id: string
          player_name: string
          prize_money: string
          rank: number
          season: number
          trend: number
        }
        Insert: {
          country_code: string
          player_id: string
          player_name: string
          prize_money: string
          rank: number
          season: number
          trend: number
        }
        Update: {
          country_code?: string
          player_id?: string
          player_name?: string
          prize_money?: string
          rank?: number
          season?: number
          trend?: number
        }
        Relationships: [
          {
            foreignKeyName: "oom_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          birth_date: string | null
          country_code: string | null
          created_at: string
          handed: Database["public"]["Enums"]["handedness"] | null
          hometown: string | null
          id: string
          images: Json | null
          name: string
          nickname: string | null
          slug: string
          stats: Json | null
          titles: Json | null
          walk_on_song: string | null
        }
        Insert: {
          birth_date?: string | null
          country_code?: string | null
          created_at?: string
          handed?: Database["public"]["Enums"]["handedness"] | null
          hometown?: string | null
          id?: string
          images?: Json | null
          name: string
          nickname?: string | null
          slug: string
          stats?: Json | null
          titles?: Json | null
          walk_on_song?: string | null
        }
        Update: {
          birth_date?: string | null
          country_code?: string | null
          created_at?: string
          handed?: Database["public"]["Enums"]["handedness"] | null
          hometown?: string | null
          id?: string
          images?: Json | null
          name?: string
          nickname?: string | null
          slug?: string
          stats?: Json | null
          titles?: Json | null
          walk_on_song?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country_code: string | null
          display_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          country_code?: string | null
          display_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          country_code?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tip_group_members: {
        Row: {
          group_id: string
          role: Database["public"]["Enums"]["group_role"]
          user_id: string
        }
        Insert: {
          group_id: string
          role: Database["public"]["Enums"]["group_role"]
          user_id: string
        }
        Update: {
          group_id?: string
          role?: Database["public"]["Enums"]["group_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tip_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "tip_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tip_group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tip_groups: {
        Row: {
          created_at: string
          id: string
          join_code: string | null
          name: string
          owner_id: string
          visibility: Database["public"]["Enums"]["group_visibility"]
        }
        Insert: {
          created_at?: string
          id?: string
          join_code?: string | null
          name: string
          owner_id: string
          visibility: Database["public"]["Enums"]["group_visibility"]
        }
        Update: {
          created_at?: string
          id?: string
          join_code?: string | null
          name?: string
          owner_id?: string
          visibility?: Database["public"]["Enums"]["group_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "tip_groups_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tips: {
        Row: {
          created_at: string
          id: string
          match_id: string
          pick_sets_a: number
          pick_sets_b: number
          pick_winner: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          pick_sets_a: number
          pick_sets_b: number
          pick_winner: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          pick_sets_a?: number
          pick_sets_b?: number
          pick_winner?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tips_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          aud: string
          role: string
          email: string
          encrypted_password: string
          email_confirmed_at: string | null
          invited_at: string | null
          confirmation_token: string | null
          confirmation_sent_at: string | null
          recovery_token: string | null
          recovery_sent_at: string | null
          email_change_token_new: string | null
          email_change: string | null
          email_change_sent_at: string | null
          last_sign_in_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          is_super_admin: boolean | null
          created_at: string | null
          updated_at: string | null
          phone: string | null
          phone_confirmed_at: string | null
          phone_change: string | null
          phone_change_token: string | null
          phone_change_sent_at: string | null
          confirmed_at: string | null
          email_change_token_current: string | null
          email_change_confirm_status: number | null
          banned_until: string | null
          reauthentication_token: string | null
          reauthentication_sent_at: string | null
          is_sso_user: boolean
          deleted_at: string | null
        }
      }
    }
    Enums: {
      event_type:
        | "t20"
        | "140"
        | "180"
        | "d20"
        | "checkout"
        | "x"
        | "pause"
        | "9d"
        | "throw"
      group_role: "owner" | "member"
      group_visibility: "public" | "private"
      handedness: "left" | "right"
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
