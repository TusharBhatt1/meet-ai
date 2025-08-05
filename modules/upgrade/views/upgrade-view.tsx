"use client";
import { LoadingState } from "@/components/loading-state";
import { checkout, customer } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PricingCard } from "../components/pricing-card";

export default function UpgradeView() {
  const trpc = useTRPC();
  const { data: currentSubscription } = useSuspenseQuery(
    trpc.premium.getCurrentSubscription.queryOptions()
  );
  const { data: products } = useSuspenseQuery(
    trpc.premium.getProducts.queryOptions()
  );
  return (
    <div className="text-center md:p-12 p-5 space-y-7">
      <p className="text-xl">
        You are on a{" "}
        <span className="text-primary font-bold">
          {currentSubscription?.name ?? "FREE"}
        </span>{" "}
        plan
      </p>

      <div className="grid grid-cols-1">
        {products.map((product) => {
          const isCurrentProduct = currentSubscription?.id === product.id;

          const isPremium = !!currentSubscription;
          let buttonText = "Upgrade";

          let onClick = () => checkout({ products: [product.id] });

          if (isCurrentProduct) {
            buttonText = "Manage";
            onClick = () => customer.portal();
          } else if (isPremium) {
            buttonText = "Change plan";
            onClick = () => customer.portal();
          }
          return (
            <PricingCard
              key={product.id}
              title={product.name}
              variant={
                product.metadata.variant === "highlighted"
                  ? "highlighted"
                  : "default"
              }
              price={
                product.prices?.[0]?.amountType === "fixed"
                  ? product.prices[0].priceAmount / 100
                  : 0
              }
              description={product.description}
              priceSuffix={`/${product.prices[0].recurringInterval}`}
              features={product.benefits.map((benefit) => benefit.description)}
              badge={product.metadata.badge as string | null}
              buttonText={buttonText}
              //@ts-expect-error later
              onClick={onClick}
            />
          );
        })}
      </div>
    </div>
  );
}

export const UpgradeViewLoading = () => {
  return (
    <LoadingState
      title="Loading"
      description="Please wait while we load the agents"
    />
  );
};
