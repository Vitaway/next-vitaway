import { Suspense } from "react";
import { BookVisitScreen } from "@/app/components/plus/care/book-visit";

export const metadata = { title: "Book a visit" };

export default function Page() {
  return (
    <Suspense>
      <BookVisitScreen />
    </Suspense>
  );
}
