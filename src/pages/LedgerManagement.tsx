
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

interface LedgerEntry {
  id: number;
  vendorId: string;
  challanNo: string;
  debit: number;
  credit: number;
  ledger: string;
}

interface DetailEntry {
  id: number;
  description: string;
  quantity: number;
  priceMtr: number;
}

const initialLedger: LedgerEntry[] = [
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
  const [ledger, setLedger] = useState<LedgerEntry[]>(initialLedger);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<LedgerEntry>>({});
  const [details, setDetails] = useState<DetailEntry[]>([]);
  const [newDetail, setNewDetail] = useState<DetailEntry>({
    id: 1,
    description: "",
    quantity: 0,
    priceMtr: 0,
  });

  const handleSave = () => {
    if (newEntry.id) {
      setLedger(ledger.map((l) => (l.id === newEntry.id ? { ...newEntry as LedgerEntry } : l)));
    } else {
      setLedger([...ledger, { ...newEntry as LedgerEntry, id: ledger.length + 1 }]);
    }
    setIsDialogOpen(false);
    setNewEntry({});
  };

  const handleAddDetail = () => {
    setDetails([...details, newDetail]);
    setNewDetail({
      id: details.length + 2,
      description: "",
      quantity: 0,
      priceMtr: 0,
    });
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
                    onClick={() => setIsDetailsOpen(true)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Entry Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input
                value={newDetail.description}
                onChange={(e) =>
                  setNewDetail({ ...newDetail, description: e.target.value })
                }
                placeholder="Description"
              />
              <Input
                type="number"
                value={newDetail.quantity}
                onChange={(e) =>
                  setNewDetail({
                    ...newDetail,
                    quantity: Number(e.target.value),
                  })
                }
                placeholder="Quantity"
              />
              <Input
                type="number"
                value={newDetail.priceMtr}
                onChange={(e) =>
                  setNewDetail({
                    ...newDetail,
                    priceMtr: Number(e.target.value),
                  })
                }
                placeholder="Price/Mtr"
              />
            </div>
            <Button onClick={handleAddDetail}>Add Detail</Button>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price/Mtr</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell>{detail.description}</TableCell>
                    <TableCell>{detail.quantity}</TableCell>
                    <TableCell>${detail.priceMtr}</TableCell>
                    <TableCell>
                      ${detail.quantity * detail.priceMtr}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LedgerManagement;
