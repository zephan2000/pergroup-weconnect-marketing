/**
 * Payload REST API handler.
 * All requests to /api/* are forwarded to Payload's REST layer.
 *
 * SECURITY: Public read endpoints are gated by Payload collection access control.
 * Write operations require a valid Payload JWT (CMS editor session).
 * Logged to SECURITY.md.
 */
import { REST_DELETE, REST_GET, REST_PATCH, REST_POST } from '@payloadcms/next/routes'
import configPromise from '@payload-config'

export const GET = REST_GET(configPromise)
export const POST = REST_POST(configPromise)
export const DELETE = REST_DELETE(configPromise)
export const PATCH = REST_PATCH(configPromise)
