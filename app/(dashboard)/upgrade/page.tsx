import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";
import UpgradeView, {
  UpgradeViewLoading,
} from "@/modules/upgrade/views/upgrade-view";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.premium.getCurrentSubscription.queryOptions());
  void queryClient.prefetchQuery(trpc.premium.getProducts.queryOptions());

  return (
    <div className="space-y-7">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<UpgradeViewLoading />}>
          <UpgradeView />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
