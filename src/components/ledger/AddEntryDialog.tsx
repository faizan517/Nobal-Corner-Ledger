
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LedgerEntry } from "@/types/ledger";

interface AddEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: Partial<LedgerEntry>) => void;
}

const AddEntryDialog = ({ isOpen, onOpenChange, onSave }: AddEntryDialogProps) => {
  const [newEntry, setNewEntry] = useState<Partial<LedgerEntry>>({});

  const handleSave = () => {
    onSave(newEntry);
    setNewEntry({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Ledger Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Vendor ID"
              value={newEntry.vendorId || ""}
              onChange={(e) =>
                setNewEntry({ ...newEntry, vendorId: e.target.value })
              }
            />
            <Input
              placeholder="Challan No"
              value={newEntry.challanNo || ""}
              onChange={(e) =>
                setNewEntry({ ...newEntry, challanNo: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Debit"
              value={newEntry.debit || ""}
              onChange={(e) =>
                setNewEntry({ ...newEntry, debit: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="Credit"
              value={newEntry.credit || ""}
              onChange={(e) =>
                setNewEntry({ ...newEntry, credit: Number(e.target.value) })
              }
            />
            <Select
              onValueChange={(value) =>
                setNewEntry({ ...newEntry, ledger: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Ledger Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Payment">Payment</SelectItem>
                <SelectItem value="Return">Return</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryDialog;
