
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
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const VendorDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vendorData = location.state?.vendor || {};

  const [details, setDetails] = useState([]);
  const [newDetail, setNewDetail] = useState({
    description: "",
    quantity: "",
    priceMtr: "",
  });

  const handleAddDetail = () => {
    if (newDetail.description && newDetail.quantity && newDetail.priceMtr) {
      setDetails([...details, { ...newDetail, id: details.length + 1 }]);
      setNewDetail({ description: "", quantity: "", priceMtr: "" });
    }
  };

  const handleDeleteDetail = (id) => {
    setDetails(details.filter((detail) => detail.id !== id));
  };

  const calculateTotal = () => {
    return details.reduce((sum, detail) => {
      return sum + detail.quantity * detail.priceMtr;
    }, 0);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Vendor Details</h1>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium">Vendor ID</label>
            <div className="mt-1 text-lg">{vendorData.vendorId || "-"}</div>
          </div>
          <div>
            <label className="text-sm font-medium">Challan No</label>
            <div className="mt-1 text-lg">{vendorData.challanNo || "-"}</div>
          </div>
          <div>
            <label className="text-sm font-medium">Date</label>
            <div className="mt-1 text-lg">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Description"
              value={newDetail.description}
              onChange={(e) =>
                setNewDetail({ ...newDetail, description: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={newDetail.quantity}
              onChange={(e) =>
                setNewDetail({ ...newDetail, quantity: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Price/Mtr"
              value={newDetail.priceMtr}
              onChange={(e) =>
                setNewDetail({ ...newDetail, priceMtr: e.target.value })
              }
            />
          </div>
          <Button onClick={handleAddDetail}>
            <Plus className="w-4 h-4 mr-2" />
            Add Detail
          </Button>
        </div>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price/Mtr</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell>{detail.description}</TableCell>
                  <TableCell>{detail.quantity}</TableCell>
                  <TableCell>${detail.priceMtr}</TableCell>
                  <TableCell>
                    ${(detail.quantity * detail.priceMtr).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDetail(detail.id)}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="bg-gray-100 p-4 rounded-lg">
            <span className="font-medium">Total Amount: </span>
            <span className="text-lg font-bold">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VendorDetail;
