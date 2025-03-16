
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LedgerEntryFormData, Vendor } from '@/types/ledgerTypes';
import LedgerEntryForm from './LedgerEntryForm';
import { Fonts } from '@/utils/Font.jsx';

interface AddLedgerDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  vendors: Vendor[];
  newEntry: LedgerEntryFormData;
  setNewEntry: (entry: LedgerEntryFormData) => void;
  onSave: () => void;
  onOpenChange: (open: boolean) => void;
}

const AddLedgerDialog = ({ 
  isOpen, 
  setIsOpen, 
  vendors, 
  newEntry, 
  setNewEntry, 
  onSave,
  onOpenChange
}: AddLedgerDialogProps) => {
  const resetForm = () => {
    setNewEntry({
      descriptions: [''],
      quantities: [''],
      price_per_meter: [''],
      date: '',
      vendor_name: '',
      challan_no: '',
      debit: '',
      credit: '',
      balance: '',
      payment_method: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild className="bg-black text-white hover:bg-gray-200">
        <Button onClick={resetForm} 
          style={{ ...Fonts.Poppins }}
          className="w-full sm:w-auto bg-black text-white hover:bg-gray-200 hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2 font-bold" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Ledger Entry</DialogTitle>
        </DialogHeader>
        <LedgerEntryForm 
          vendors={vendors} 
          newEntry={newEntry} 
          setNewEntry={setNewEntry} 
          onSave={onSave} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddLedgerDialog;
