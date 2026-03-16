/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  TODO: WeConnect User Auth — NOT IMPLEMENTED IN v1          ║
 * ║                                                             ║
 * ║  Per CLAUDE.md (Authentication — CURRENT SCOPE):            ║
 * ║  "WeConnect user auth: NOT in scope for v1"                 ║
 * ║  "Do NOT introduce Clerk, Auth0, or any third-party         ║
 * ║   auth provider yet"                                        ║
 * ║                                                             ║
 * ║  When scoping v2 auth, evaluate Supabase Auth first —       ║
 * ║  it is already part of the existing Supabase project and    ║
 * ║  avoids introducing a new vendor dependency.                ║
 * ║                                                             ║
 * ║  All methods below throw NotImplementedError intentionally. ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ---------------------------------------------------------------------------
// Error type
// ---------------------------------------------------------------------------

export class NotImplementedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotImplementedError'
  }
}

const V1_MESSAGE =
  'WeConnect auth is not implemented in v1. See CLAUDE.md for scope.'

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IWeConnectAuth {
  /**
   * Sign in a WeConnect user.
   * TODO: implement in v2 — evaluate Supabase Auth (supabase.auth.signIn*)
   */
  signIn(email: string, password: string): Promise<never>

  /**
   * Sign out the current WeConnect user.
   * TODO: implement in v2 — evaluate Supabase Auth (supabase.auth.signOut)
   */
  signOut(): Promise<never>

  /**
   * Get the current session.
   * TODO: implement in v2 — evaluate Supabase Auth (supabase.auth.getSession)
   */
  getSession(): Promise<never>

  /**
   * Get the current user.
   * TODO: implement in v2 — evaluate Supabase Auth (supabase.auth.getUser)
   */
  getUser(): Promise<never>
}

// ---------------------------------------------------------------------------
// Stub implementation — all methods throw
// ---------------------------------------------------------------------------

export const weConnectAuth: IWeConnectAuth = {
  async signIn(_email: string, _password: string): Promise<never> {
    throw new NotImplementedError(V1_MESSAGE)
  },

  async signOut(): Promise<never> {
    throw new NotImplementedError(V1_MESSAGE)
  },

  async getSession(): Promise<never> {
    throw new NotImplementedError(V1_MESSAGE)
  },

  async getUser(): Promise<never> {
    throw new NotImplementedError(V1_MESSAGE)
  },
}
