import { Suspense } from "react";
import SubscriptionNotice from "../../components/SubscriptionNotice";

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <SubscriptionNotice />
    </Suspense>
  );
}
