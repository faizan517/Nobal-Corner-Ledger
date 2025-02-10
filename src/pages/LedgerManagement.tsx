
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import AddEntryDialog from "@/components/ledger/AddEntryDialog";
import LedgerTable from "@/components/ledger/LedgerTable";
import { LedgerEntry } from "@/types/ledger";

const initialLedger: LedgerEntry[] = [
  {
    id: 1,
    vendorId: "V001",
    challanNo: "CH001",
    debit: 1000,
    credit: 0,
    ledger: "Purchase",
    details: [] // Added the required details array
  },
  {
    id: 2,
    vendorId: "V002",
    challanNo: "CH002",
    debit: 0,
    credit: 500,
    ledger: "Payment",
    details: [] // Added the required details array
  },
];

const LedgerManagement = () => {
  const [ledger, setLedger] = useState<LedgerEntry[]>(initialLedger);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (newEntry: Partial<LedgerEntry>) => {
    if (newEntry.id) {
      setLedger(ledger.map((l) => (l.id === newEntry.id ? { ...newEntry as LedgerEntry } : l)));
    } else {
      setLedger([...ledger, { ...newEntry as LedgerEntry, id: ledger.length + 1 }]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Ledger Management</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      <Card>
        <LedgerTable entries={ledger} />
      </Card>

      <AddEntryDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </div>
  );
};

export default LedgerManagement;
