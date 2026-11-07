import { ActionButton } from '@/components/ui/Button';
export default function DonateForm() {
  return <div className="space-y-6 max-w-2xl">
    <p className="text-hct-cloud font-body">Online giving is not available yet. We are setting up a safe way to give. No payment or gift details can be sent here right now.</p>
    <ActionButton type="button" variant="donate" disabled>Online Giving Coming Soon</ActionButton>
    <p className="text-xs text-hct-silver font-body">Hillsboro Civic Theater is a registered 501(c)(3) nonprofit. EIN: PENDING.</p>
  </div>;
}
