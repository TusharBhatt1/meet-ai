import { ResponsiveDialog } from "./responsive-dialog";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
interface Props {
  openConfirmationDialog:boolean;
  setOpenConfirmationDialog:(v:boolean)=>void;
  title: string;
  description: string;
  onConfirm: () => void;
  isProcessing: boolean;
}
export default function ConfirmDialog({
  openConfirmationDialog,
  setOpenConfirmationDialog,
  title,
  description,
  onConfirm,
  isProcessing,
}: Props) {
  
  return(
    <ResponsiveDialog
      open={openConfirmationDialog}
      onOpenChange={() => setOpenConfirmationDialog(false)}
      title={title}
      description={description}
    >
      <div className="flex justify-end gap-4">
        <Button
          onClick={() => setOpenConfirmationDialog(false)}
          variant="outline"
        >
          Cancel
        </Button>
        <Button disabled={isProcessing} onClick={onConfirm}>
          {isProcessing && <LoaderCircle className="animate-spin" />} Confirm
        </Button>
      </div>
    </ResponsiveDialog>
  );

}
