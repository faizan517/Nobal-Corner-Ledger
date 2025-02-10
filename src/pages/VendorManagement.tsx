
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

interface Vendor {
  id: number;
  name: string;
  company: string;
  contact: string;
  address: string;
}

const VendorManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all vendors
  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: vendorApi.getAllVendors,
  });

  // Add/Update vendor mutation
  const vendorMutation = useMutation({
    mutationFn: (vendor: Partial<Vendor>) => {
      if (vendor.id) {
        return vendorApi.updateVendor(String(vendor.id), vendor);
      }
      return vendorApi.addVendor(vendor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: "Success",
        description: `Vendor ${newVendor.id ? 'updated' : 'added'} successfully`,
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

  // Delete vendor mutation
  const deleteVendorMutation = useMutation({
    mutationFn: (id: number) => vendorApi.deleteVendor(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    vendorMutation.mutate(newVendor);
  };

  const handleEdit = (vendor: Vendor) => {
    setNewVendor(vendor);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteVendorMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Vendor Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setNewVendor({})}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {newVendor.id ? "Edit Vendor" : "Add New Vendor"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={newVendor.name || ""}
                onChange={(e) =>
                  setNewVendor({ ...newVendor, name: e.target.value })
                }
              />
              <Input
                placeholder="Company"
                value={newVendor.company || ""}
                onChange={(e) =>
                  setNewVendor({ ...newVendor, company: e.target.value })
                }
              />
              <Input
                placeholder="Contact"
                value={newVendor.contact || ""}
                onChange={(e) =>
                  setNewVendor({ ...newVendor, contact: e.target.value })
                }
              />
              <Input
                placeholder="Address"
                value={newVendor.address || ""}
                onChange={(e) =>
                  setNewVendor({ ...newVendor, address: e.target.value })
                }
              />
              <Button onClick={handleSave} className="w-full">
                Save
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
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.id}</TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.company}</TableCell>
                <TableCell>{vendor.contact}</TableCell>
                <TableCell>{vendor.address}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(vendor)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(vendor.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default VendorManagement;
