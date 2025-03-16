
import { Vendor } from '@/types/ledgerTypes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Fonts } from '@/utils/Font.jsx';
import { useIsMobile } from "@/hooks/use-mobile";

interface LedgerTableProps {
  vendors: Vendor[];
  onViewDetails: (vendor: Vendor) => void;
}

const LedgerTable = ({ vendors, onViewDetails }: LedgerTableProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>Company Name</TableHead>
          <TableHead style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>Supplier Name</TableHead>
          <TableHead style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>Phone Number</TableHead>
          <TableHead style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>Balance</TableHead>
          <TableHead style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendors.map((vendor: Vendor, index: number) => (
          <TableRow key={index}>
            <TableCell style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}>{vendor.company_name}</TableCell>
            <TableCell style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}>{vendor.supplier_name}</TableCell>
            <TableCell style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}>{vendor.phone_no}</TableCell>
            <TableCell style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}>
              {Number(vendor.balance).toLocaleString('ur-PK')}
            </TableCell>
            <TableCell>
              <Button 
                onClick={() => onViewDetails(vendor)} 
                className="bg-black text-white hover:bg-gray-200" 
                style={{ ...Fonts.Roboto }}
              >
                Ledger
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LedgerTable;
