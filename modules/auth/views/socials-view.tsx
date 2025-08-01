import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import googleIcon from "@/public/google.svg";
import githubIcon from "@/public/github.svg";

export default function SocialsView({ submitting }: { submitting: boolean }) {
  const { onSocial } = useAuth();

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        disabled={submitting}
        variant={"outline"}
        onClick={() => onSocial("google")}
        type="button"
      >
        <Image src={googleIcon} height={20} width={20} alt="Google" /> Google
      </Button>
      <Button
        disabled={submitting}
        variant={"outline"}
        type="button"
        onClick={() => onSocial("github")}
      >
        <Image src={githubIcon} height={20} width={20} alt="Github" />
        Github
      </Button>
    </div>
  );
}
