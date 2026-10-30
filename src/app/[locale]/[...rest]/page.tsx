import { notFound } from 'next/navigation';

// Any unknown /en/... or /bn/... address shows the site's own 404 page (app/[locale]/not-found.tsx)
export default function CatchAll() {
  notFound();
}
