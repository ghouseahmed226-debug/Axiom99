// [Agent-23: Firebase WebSockets Lead] + [Agent-27: Client-Side Prediction]
// Real-time session client with bit-packed input encoding
import { initializeApp, getApps }                         from 'firebase/app'
import { getDatabase, ref, set, onValue, onDisconnect,
         serverTimestamp, DatabaseReference }             from 'firebase/database'
import { getAuth }                                        from 'firebase/auth'
import type { InputFrame }                               from '../../store/player'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || 'mock_key',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mock_domain',
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://mock.firebaseio.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mock_project',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mock_bucket',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'mock_sender',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID || 'mock_app_id',
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db   = getDatabase(app)
export const auth = getAuth(app)

export class RealtimeSession {
  private playerRef: DatabaseReference
  private inputRef:  DatabaseReference

  constructor(
    private readonly sessionId: string,
    private readonly uid:       string
  ) {
    this.playerRef = ref(db, `sessions/${sessionId}/players/${uid}`)
    this.inputRef  = ref(db, `sessions/${sessionId}/inputs/${uid}`)
    onDisconnect(this.playerRef).remove()
    onDisconnect(this.inputRef).remove()
  }

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

  publishInput(frame: InputFrame) {
    return set(this.inputRef, {
      tick:    frame.seq,
      actions: encodeInput(frame),
      ts:      serverTimestamp(),
    })
  }

  subscribeToPlayers(
    onUpdate: (uid: string, data: Record<string, unknown>) => void,
  ) {
    const playersRef = ref(db, `sessions/${this.sessionId}/players`)
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

function encodeInput(f: InputFrame): string {
  const bits =
    (f.forward ? 1  : 0) | (f.back   ? 2  : 0) |
    (f.left    ? 4  : 0) | (f.right  ? 8  : 0) |
    (f.jump    ? 16 : 0) | (f.sprint ? 32 : 0)
  return `${bits}:${f.yaw.toFixed(4)}:${f.pitch.toFixed(4)}`
}