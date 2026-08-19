// [Agent-42: Supabase Auth Specialist] — Typed Supabase client
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock_anon_key',
  {
    auth: {
      autoRefreshToken:   true,
      persistSession:     true,
      detectSessionInUrl: true,
      storage:            typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    realtime: { params: { eventsPerSecond: 10 } },
    db: { schema: 'public' },
  }
)