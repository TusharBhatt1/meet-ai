import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const pricingCardVariants = cva(
  "rounded-xl border shadow-sm p-6 gap-4 flex flex-col justify-between transition-colors",
  {
    variants: {
      variant: {
        default: "bg-white text-black border-muted",
        highlighted: "bg-primary text-white border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface PricingCardProps extends VariantProps<typeof pricingCardVariants> {
  title: string;
  price: number;
  priceSuffix: string;
  badge?: string | null;
  description?: string | null;
  features?: string[];
  buttonText: string;
  onClick: () => void | Promise<void>;
  className?: string;
}

export const PricingCard = ({
  title,
  price,
  priceSuffix,
  badge,
  description,
  features = [],
  buttonText,
  onClick,
  variant,
  className,
}: PricingCardProps) => {
  return (
    <div className={cn(pricingCardVariants({ variant }), className)}>
      <div>
        {badge && (
          <div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {badge}
          </div>
        )}
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="mt-2 text-4xl font-bold tracking-tight text-primary">
          ${price}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            {priceSuffix}
          </span>
        </div>
        {description && (
          <p className="mt-2 text-sm font-semibold">{description}</p>
        )}
        {features?.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm flex justify-center items-center flex-col">
            {features.map((f, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <p>{f}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button onClick={onClick} className="mt-6 w-full">
        {buttonText}
      </Button>
    </div>
  );
};
