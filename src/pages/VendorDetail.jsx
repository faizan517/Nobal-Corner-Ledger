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
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Download } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ledgerApi } from "@/services/api";

const VendorDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const vendorData = location.state?.vendor || {};

  const [entries, setEntries] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    challanNo: "",
    description: "",
    quantity: "",
    priceMtr: "",
    debit: "",
    credit: "",
    paymentMethod: "cash"
  });

  const handleDownloadReport = async () => {
    try {
      if (!startDate || !endDate) {
        toast({
          title: "Error",
          description: "Please select both start and end dates",
          variant: "destructive"
        });
        return;
      }

      const blob = await ledgerApi.getLedgerReport(vendorData.company_name, startDate, endDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ledger-report-${vendorData.company_name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Report downloaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive"
      });
    }
  };

  const handleAddEntry = () => {
    if (!newEntry.challanNo || !newEntry.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setEntries([...entries, { ...newEntry, id: entries.length + 1 }]);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      challanNo: "",
      description: "",
      quantity: "",
      priceMtr: "",
      debit: "",
      credit: "",
      paymentMethod: "cash"
    });
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: "Entry added successfully"
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">{vendorData.vendorId || "Vendor"} Details</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              className="w-36"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              className="w-36"
            />
            <Button onClick={handleDownloadReport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Add New Entry</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  />
                  <Input
                    placeholder="Challan No"
                    value={newEntry.challanNo}
                    onChange={(e) => setNewEntry({ ...newEntry, challanNo: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Description"
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={newEntry.quantity}
                    onChange={(e) => setNewEntry({ ...newEntry, quantity: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Price/Mtr"
                    value={newEntry.priceMtr}
                    onChange={(e) => setNewEntry({ ...newEntry, priceMtr: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Debit"
                    value={newEntry.debit}
                    onChange={(e) => setNewEntry({ ...newEntry, debit: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Credit"
                    value={newEntry.credit}
                    onChange={(e) => setNewEntry({ ...newEntry, credit: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newEntry.paymentMethod}
                    onChange={(e) => setNewEntry({ ...newEntry, paymentMethod: e.target.value })}
                  >
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
                <Button onClick={handleAddEntry}>Submit</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Challan No</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price/Mtr</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.challanNo}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>{entry.quantity}</TableCell>
                <TableCell>${entry.priceMtr}</TableCell>
                <TableCell>${entry.debit}</TableCell>
                <TableCell>${entry.credit}</TableCell>
                <TableCell className="capitalize">{entry.paymentMethod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default VendorDetail;
