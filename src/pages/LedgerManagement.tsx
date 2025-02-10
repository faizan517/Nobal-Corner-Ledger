
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddEntryDialog from "@/components/ledger/AddEntryDialog";
import LedgerTable from "@/components/ledger/LedgerTable";
import { LedgerEntry } from "@/types/ledger";
import { ledgerApi } from "@/services/api";

const LedgerManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all ledgers
  const { data: ledger = [], isLoading } = useQuery({
    queryKey: ['ledgers'],
    queryFn: ledgerApi.getAllLedgers,
  });

  // Add new ledger entry mutation
  const addLedgerMutation = useMutation({
    mutationFn: (newEntry: Partial<LedgerEntry>) => ledgerApi.addLedgerEntry(newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledgers'] });
      toast({
        title: "Success",
        description: "Ledger entry added successfully",
      });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = (newEntry: Partial<LedgerEntry>) => {
    addLedgerMutation.mutate(newEntry);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
