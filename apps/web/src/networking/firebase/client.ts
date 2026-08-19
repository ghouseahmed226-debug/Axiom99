// [Agent-23: Firebase WebSockets Lead] + [Agent-27: Client-Side Prediction]
// Real-time session client with bit-packed input encoding
import { initializeApp, getApps }                         from 'firebase/app'
import { getDatabase, ref, set, onValue, onDisconnect,
         serverTimestamp, DatabaseReference }             from 'firebase/database'
import { getAuth }                                        from 'firebase/auth'
import type { InputFrame }                               from '../../store/player'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db   = getDatabase(app)
export const auth = getAuth(app)

/**
 * RealtimeSession — manages ephemeral player state for a single game session.
 * Position stream: ~64 Hz, ~50 bytes/frame, delta-3dp precision
 * Input stream:    bit-packed 8 buttons + float yaw/pitch
 */
export class RealtimeSession {
  private playerRef: DatabaseReference
  private inputRef:  DatabaseReference

  constructor(
    private readonly sessionId: string,
    private readonly uid:       string
  ) {
    this.playerRef = ref(db, sessions//players/)
    this.inputRef  = ref(db, sessions//inputs/)
    // Auto-remove state on disconnect (no ghost players)
    onDisconnect(this.playerRef).remove()
    onDisconnect(this.inputRef).remove()
  }

  /** Publish authoritative position at 64 Hz */
  publishState(x: number, y: number, z: number, yaw: number, seq: number) {
    return set(this.playerRef, {
      x:   +x.toFixed(3),
      y:   +y.toFixed(3),
      z:   +z.toFixed(3),
      yaw: +yaw.toFixed(4),
      seq,
      ts:  serverTimestamp(),
    })
  }

  /** Publish bit-packed input frame */
  publishInput(frame: InputFrame) {
    return set(this.inputRef, {
      tick:    frame.seq,
      actions: encodeInput(frame),
      ts:      serverTimestamp(),
    })
  }

  /** Subscribe to all remote players */
  subscribeToPlayers(
    onUpdate: (uid: string, data: Record<string, unknown>) => void,
  ) {
    const playersRef = ref(db, sessions//players)
    return onValue(playersRef, snap => {
      if (!snap.exists()) return
      snap.forEach(child => {
        if (child.key && child.key !== this.uid) {
          onUpdate(child.key, child.val() as Record<string, unknown>)
        }
      })
    })
  }
}

/**
 * Bit-pack 6 buttons + yaw/pitch into a compact colon-delimited string.
 * Format: "<buttonBits>:<yaw>:<pitch>"
 * Bits: forward=1, back=2, left=4, right=8, jump=16, sprint=32
 */
function encodeInput(f: InputFrame): string {
  const bits =
    (f.forward ? 1  : 0) | (f.back   ? 2  : 0) |
    (f.left    ? 4  : 0) | (f.right  ? 8  : 0) |
    (f.jump    ? 16 : 0) | (f.sprint ? 32 : 0)
  return ${bits}::
}
