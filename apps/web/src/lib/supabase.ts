// [Agent-42: Supabase Auth Specialist] — Typed Supabase client
import { createClient } from '@supabase/supabase-js'

// Run: npx supabase gen types typescript --project-id YOUR_ID > src/types/supabase.generated.ts
// Then replace 'any' below with the generated Database type
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  {
    auth: {
      autoRefreshToken:   true,
      persistSession:     true,
      detectSessionInUrl: true,
      storage:            localStorage,
    },
    realtime: { params: { eventsPerSecond: 10 } },
    db: { schema: 'public' },
  }
)
