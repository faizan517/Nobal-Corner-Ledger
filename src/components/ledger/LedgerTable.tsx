
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { LedgerEntry } from "@/types/ledger";

interface LedgerTableProps {
  entries: LedgerEntry[];
}

const LedgerTable = ({ entries }: LedgerTableProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (entry: LedgerEntry) => {
    navigate("/vendor-detail", { state: { vendor: entry } });
  };

  return (
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
        {entries.map((entry) => (
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
  );
};

export default LedgerTable;
