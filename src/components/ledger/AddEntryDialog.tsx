
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
import { Plus, Trash2 } from "lucide-react";
import { LedgerEntry, DetailEntry } from "@/types/ledger";

interface AddEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: Partial<LedgerEntry>) => void;
}

const AddEntryDialog = ({ isOpen, onOpenChange, onSave }: AddEntryDialogProps) => {
  const [newEntry, setNewEntry] = useState<Partial<LedgerEntry>>({
    details: []
  });

  const addDetailEntry = () => {
    setNewEntry({
      ...newEntry,
      details: [
        ...(newEntry.details || []),
        { id: Date.now(), description: "", quantity: 0, priceMtr: 0 }
      ]
    });
  };

  const removeDetailEntry = (id: number) => {
    setNewEntry({
      ...newEntry,
      details: (newEntry.details || []).filter(detail => detail.id !== id)
    });
  };

  const updateDetailEntry = (id: number, field: keyof DetailEntry, value: string | number) => {
    setNewEntry({
      ...newEntry,
      details: (newEntry.details || []).map(detail =>
        detail.id === id ? { ...detail, [field]: value } : detail
      )
    });
  };

  const handleSave = () => {
    onSave(newEntry);
    setNewEntry({ details: [] });
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

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Details</h3>
              <Button type="button" onClick={addDetailEntry} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Detail
              </Button>
            </div>

            {(newEntry.details || []).map((detail) => (
              <div key={detail.id} className="grid grid-cols-4 gap-2 items-center">
                <Input
                  placeholder="Description"
                  value={detail.description}
                  onChange={(e) => updateDetailEntry(detail.id, "description", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={detail.quantity}
                  onChange={(e) => updateDetailEntry(detail.id, "quantity", Number(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Price/Mtr"
                  value={detail.priceMtr}
                  onChange={(e) => updateDetailEntry(detail.id, "priceMtr", Number(e.target.value))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDetailEntry(detail.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
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
