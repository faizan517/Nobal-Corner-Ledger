
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialLedger = [
  {
    id: 1,
    vendorId: "V001",
    challanNo: "CH001",
    debit: 1000,
    credit: 0,
    ledger: "Purchase",
  },
  {
    id: 2,
    vendorId: "V002",
    challanNo: "CH002",
    debit: 0,
    credit: 500,
    ledger: "Payment",
  },
];

const LedgerManagement = () => {
  const navigate = useNavigate();
  const [ledger, setLedger] = useState(initialLedger);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({});

  const handleSave = () => {
    if (newEntry.id) {
      setLedger(ledger.map((l) => (l.id === newEntry.id ? newEntry : l)));
    } else {
      setLedger([...ledger, { ...newEntry, id: ledger.length + 1 }]);
    }
    setIsDialogOpen(false);
    setNewEntry({});
  };

  const handleViewDetails = (entry) => {
    navigate("/vendor-detail", { state: { vendor: entry } });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Ledger Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setNewEntry({})}>
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
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
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Vendor ID</TableHead>
              <TableHead>Challan No</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Ledger</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ledger.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.id}</TableCell>
                <TableCell>{entry.vendorId}</TableCell>
                <TableCell>{entry.challanNo}</TableCell>
                <TableCell>${entry.debit}</TableCell>
                <TableCell>${entry.credit}</TableCell>
                <TableCell>{entry.ledger}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewDetails(entry)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default LedgerManagement;
