/**
 * @weconnect slot default — renders nothing when no intercepting route is active.
 * Required by Next.js: without this file, every page that renders the root layout
 * would 404 because the parallel slot has no content.
 */
export default function WeConnectSlotDefault() {
  return <></>
}
