import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { vendorApi } from "@/services/api";
import { Fonts } from '@/utils/Font.jsx';
import { useIsMobile } from "@/hooks/use-mobile";

interface Vendor {
  id: number;
  company_name: string;
  contact_number: string;
  supplier_name: string;
  bank_details: string;
}

const VendorManagement = () => {
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 7;

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const data = await vendorApi.getAllVendors();
      console.log('Fetched vendors:', data);
      return data;
    },
  });

  const vendorMutation = useMutation({
    mutationFn: (vendor: Partial<Vendor>) => {
      if (vendor.id) {
        return vendorApi.updateVendor(String(vendor.id), vendor);
      }
      return vendorApi.addVendor(vendor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast({
        title: "Success",
        description: `Vendor ${newVendor.id ? "updated" : "added"} successfully`,
      });
      setIsDialogOpen(false);
      setNewVendor({});
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: (id: number) => vendorApi.deleteVendor(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setVendorToDelete(null);
    },
    onError: (error: Error) => {
      console.log("Error deleting vendor:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!newVendor.company_name || !newVendor.contact_number || !newVendor.supplier_name || !newVendor.bank_details) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    vendorMutation.mutate(newVendor);
  };

  const handleEdit = (vendor: Vendor) => {
    setNewVendor(vendor);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirmation = (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (vendorToDelete) {
      deleteVendorMutation.mutate(vendorToDelete.id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor);

  const totalPages = Math.ceil(vendors.length / vendorsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ ...Fonts.Poppins }}>
          Vendor Management
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setNewVendor({})} 
              className="w-full sm:w-auto bg-black text-white hover:bg-primary hover:text-white"
              style={{ ...Fonts.Poppins }}
            >
              <Plus className="w-4 h-4 mr-2 font-bold" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] w-[95vw] mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl" style={{ ...Fonts.Poppins }}>
                {newVendor.id ? "Edit Vendor" : "Add New Vendor"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Company Name"
                value={newVendor.company_name || ""}
                onChange={(e) => {
                  if (newVendor.id) return;
                  setNewVendor({ ...newVendor, company_name: e.target.value })
                }}
                disabled={!!newVendor.id}
                className="w-full"
              />
              <Input
                placeholder="Contact Number (03xxxxxxxxx)"
                value={newVendor.contact_number || "03"}
                onChange={(e) => {
                  let value = e.target.value;
                  if (!value.startsWith('03')) value = '03';
                  value = value.replace(/[^\d]/g, '').slice(0, 11);
                  setNewVendor({ ...newVendor, contact_number: value });
                }}
                className="w-full"
              />
              <Input
                placeholder="Supplier Name"
                value={newVendor.supplier_name || ""}
                onChange={(e) =>
                  setNewVendor({ ...newVendor, supplier_name: e.target.value })
                }
                className="w-full"
              />
              <Input
                placeholder="Bank Details"
                value={newVendor.bank_details || ""}
                onChange={(e) =>
                  setNewVendor({ ...newVendor, bank_details: e.target.value })
                }
                className="w-full"
              />
              <Button 
                onClick={handleSave} 
                className="w-full bg-black text-white hover:bg-primary hover:text-white"
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-x-auto">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap min-w-[120px]" style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>
                  Company Name
                </TableHead>
                <TableHead className="whitespace-nowrap min-w-[120px]" style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>
                  Supplier Name
                </TableHead>
                <TableHead className="whitespace-nowrap min-w-[120px]" style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>
                  Contact Number
                </TableHead>
                <TableHead className="whitespace-nowrap min-w-[120px]" style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>
                  Bank Details
                </TableHead>
                <TableHead className="whitespace-nowrap text-right min-w-[100px]" style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell 
                    className="font-medium break-words max-w-[150px]" 
                    style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                  >
                    {vendor.company_name}
                  </TableCell>
                  <TableCell 
                    className="break-words max-w-[150px]"
                    style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                  >
                    {vendor.supplier_name}
                  </TableCell>
                  <TableCell 
                    className="break-words max-w-[150px]"
                    style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                  >
                    {vendor.contact_number}
                  </TableCell>
                  <TableCell 
                    className="break-words max-w-[150px]"
                    style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                  >
                    {vendor.bank_details}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(vendor)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteConfirmation(vendor)}
                        className="h-8 w-8"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[400px] h-[160px]">
          <DialogHeader>
            <DialogTitle style={{ ...Fonts.Poppins }}>
              Are you sure you want to delete this vendor?
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-11">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-3 py-1 sm:px-4 sm:py-2"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="px-3 py-1 sm:px-4 sm:py-2"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <div className="flex items-center space-x-2 order-2 sm:order-1">
          <span style={{ ...Fonts.Inter }}>Page</span>
          <span className="font-semibold" style={{ ...Fonts.Inter }}>{currentPage}</span>
          <span style={{ ...Fonts.Inter }}>of {totalPages}</span>
        </div>
        <div className="flex space-x-2 order-1 sm:order-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 sm:px-4 sm:py-2"
            style={{ ...Fonts.Inter }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 sm:px-4 sm:py-2"
            style={{ ...Fonts.Inter }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorManagement;
