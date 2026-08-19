export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          avatar_url: string | null
          elo_rating: number
          level: number
          total_xp: number
          created_at: string
        }
      }
      wallets: {
        Row: {
          id: string
          player_id: string
          coins: number
          gems: number
          tickets: number
        }
      }
      items: {
        Row: {
          id: string
          slug: string
          name: string
          item_type: string
          asset_url: string
          price_coins: number
        }
      }
    }
  }
}