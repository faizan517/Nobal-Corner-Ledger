
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ledgerApi } from '@/services/api';
import { Fonts } from '@/utils/Font.jsx';
import { LedgerEntry, LedgerEntryFormData, Vendor } from '@/types/ledgerTypes';
import LedgerTable from '@/components/ledger/LedgerTable';
import Pagination from '@/components/ledger/Pagination';
import AddLedgerDialog from '@/components/ledger/AddLedgerDialog';

const LedgerManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const vendorsPerPage = 10;
  const [newEntry, setNewEntry] = useState<LedgerEntryFormData>({
    descriptions: [''],
    quantities: [''],
    price_per_meter: [''],
    date: '',
    vendor_name: '',
    phone_no: '',
    challan_no: '',
    debit: '',
    credit: '',
    balance: '',
    payment_method: ''
  });

  const { data: ledgerData = [], isLoading, isError } = useQuery({
    queryKey: ['ledgers'],
    queryFn: async () => {
      try {
        const data = await ledgerApi.getAllLedgers();
        console.log('Fetched ledger data:', data);
        return data;
      } catch (error) {
        console.error('Error fetching ledgers:', error);
        throw error;
      }
    }
  });

  // Ensure ledger is always an array
  const ledger: Vendor[] = Array.isArray(ledgerData) ? ledgerData : [];
  console.log('Processed ledger array:', ledger);

  const addLedgerMutation = useMutation({
    mutationFn: (newEntry: LedgerEntry) => ledgerApi.addLedgerEntry(newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledgers'] });
      toast({
        title: 'Success',
        description: 'Ledger entry added successfully'
      });
      setIsDialogOpen(false);
      setNewEntry({
        descriptions: [''],
        quantities: [''],
        price_per_meter: [''],
        date: '',
        vendor_name: '',
        phone_no: '',
        challan_no: '',
        debit: '',
        credit: '',
        balance: '',
        payment_method: ''
      });
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSave = () => {
    const cleanedDescriptions = newEntry.descriptions.filter(d => d !== '');
    const cleanedQuantities = newEntry.quantities.filter(q => q !== '').map(q => Number(q));
    const cleanedPricePerMeter = newEntry.price_per_meter.filter(p => p !== '').map(p => p.replace('$', ''));
    const debits = cleanedQuantities.map((quantity, index) => quantity * Number(cleanedPricePerMeter[index]));
    const balance = newEntry.credit 
      ? debits.reduce((acc, debit) => acc + debit, 0) - Number(newEntry.credit) 
      : debits.reduce((acc, debit) => acc + debit, 0);

    const entryData: LedgerEntry = {
      date: newEntry.date,
      vendor_name: newEntry.vendor_name,
      phone_no: newEntry.phone_no,
      challan_no: newEntry.challan_no,
      debit: debits.reduce((acc, debit) => acc + debit, 0),
      credit: newEntry.credit ? Number(newEntry.credit) : undefined,
      balance: balance,
      payment_method: newEntry.payment_method,
      descriptions: cleanedDescriptions,
      quantities: cleanedQuantities,
      price_per_meters: cleanedPricePerMeter,
      cheque_number: newEntry.cheque_number
    };

    addLedgerMutation.mutate(entryData);
  };

  const handleViewDetails = (vendor: Vendor) => {
    if (vendor.company_name) {
      navigate(`/vendor-detail/${vendor.company_name}`);
    } else {
      console.log('Slug is undefined for this entry');
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching ledger entries.</div>;
  }

  // Make sure we have valid data for pagination
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = Array.isArray(ledger) ? ledger.slice(indexOfFirstVendor, indexOfLastVendor) : [];

  const totalPages = Math.ceil(ledger.length / vendorsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col justify-center items-center sm:flex-row lg:justify-between lg:items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold" style={{ ...Fonts.Poppins }}>Ledger Management</h2>
        <AddLedgerDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          vendors={ledger}
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          onSave={handleSave}
          onOpenChange={handleDialogOpenChange}
        />
      </div>

      <Card>
        <LedgerTable vendors={currentVendors} onViewDetails={handleViewDetails} />
      </Card>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default LedgerManagement;
