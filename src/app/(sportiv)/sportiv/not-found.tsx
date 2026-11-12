import Button from "@/components/ui/button";
import { NOT_FOUND, RESET } from "@/lib/portal/copy";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";

/** The sportiv host's 404 before the app shell exists: the page header and one button back home. */
export default function SportivNotFound() {
  return (
    <>
      <PageHeader brand title={NOT_FOUND.title} />
      <PageBody narrow>
        <p className="text-(length:--portal-text-15) text-secondary">{NOT_FOUND.text}</p>
        <Button href="/" className="w-full">{RESET.backSigned}</Button>
      </PageBody>
    </>
  );
}
