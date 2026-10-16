import { Suspense } from "react";
import UnsubscribeNotice from "../../components/Unsubscribe-notice";

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeNotice />
    </Suspense>
  );
}
