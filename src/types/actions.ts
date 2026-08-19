/**
 * The result of every Server Action.
 *
 * A discriminated union so callers must handle both outcomes — the compiler
 * errors if only the success case is handled. `fieldErrors` mirrors React Hook
 * Form's `setError` shape (field name → messages) for per-field highlighting.
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
