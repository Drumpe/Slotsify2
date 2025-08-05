export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          coins: number
        }
        Insert: {
          id: string
          username: string
          coins?: number
          created_at?: string
        }
        Update: {
          coins?: number
        }
      }
    }
    Views: {}
    Functions: {}
  }
}
