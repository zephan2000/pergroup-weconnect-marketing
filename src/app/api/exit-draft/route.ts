/**
 * Exit Draft Mode — disables Next.js draftMode and redirects to /.
 * Safety valve for editors to return to the published view.
 */
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}
