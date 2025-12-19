// Root page redirects to default locale
import { nextRedirect } from '@/i18n/navigation';

export default function RootPage() {
  // Redirect to default locale
  nextRedirect('/zh-tw');
}
