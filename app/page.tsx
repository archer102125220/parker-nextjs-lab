// Root page redirects to default locale
import { nextRedirect } from '@/i18n/navigation/server';

export default function RootPage() {
  // Redirect to default locale using i18n-aware redirect
  // This will automatically redirect to the user's preferred locale
  nextRedirect('/zh-tw');
}
