/**
 * /platform — redirects to /platform/spaces (the v1 live tab).
 */
import { redirect } from 'next/navigation'

export default function PlatformRoot() {
  redirect('/platform/spaces')
}
