
import { ContentText } from "@/components/cms/ContentProvider";
import { ActionButton } from '@/components/ui/Button';
export default function DonateForm() {
  return <div className="space-y-6 max-w-2xl">
    <p className="text-hct-cloud font-body"><ContentText>Online giving is not available yet. We are setting up a safe way to give. No payment or gift details can be sent here right now.</ContentText></p>
    <ActionButton type="button" variant="donate" disabled><ContentText>Online Giving Coming Soon</ContentText></ActionButton>
    <p className="text-xs text-hct-silver font-body"><ContentText>Hillsboro Civic Theater is a registered 501(c)(3) nonprofit. EIN: PENDING.</ContentText></p>
  </div>;
}
