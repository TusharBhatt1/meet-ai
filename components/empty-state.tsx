import Image from "next/image";

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/empty.svg" height={240} width={240} alt="Meet.AI" />
      <div className="flex flex-col gap-y-4 text-center max-w-md mx-auto">
        <h6 className="text-lg font-medium">{title}</h6>
        <p className="text-sm text-muted-foreground max-w-xl">{description}</p>
      </div>
    </div>
  );
};
