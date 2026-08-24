import { redirect } from 'next/navigation';

export default function ReferralRedirectPage({ params }: { params: { token: string } }) {
  // Redirect to signup page with referral token as query parameter
  redirect(`/auth/signup?ref=${params.token}`);
}
