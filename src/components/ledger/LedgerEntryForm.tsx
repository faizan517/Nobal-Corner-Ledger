
import { useState, useEffect } from 'react';
import { LedgerEntryFormData, Vendor } from '@/types/ledgerTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Fonts } from '@/utils/Font.jsx';

interface LedgerEntryFormProps {
  vendors: Vendor[];
  newEntry: LedgerEntryFormData;
  setNewEntry: (entry: LedgerEntryFormData) => void;
  onSave: () => void;
}

const LedgerEntryForm = ({ vendors, newEntry, setNewEntry, onSave }: LedgerEntryFormProps) => {
  // Make sure the units array is properly initialized
  useEffect(() => {
    if (!newEntry.units || newEntry.units.length !== newEntry.descriptions.length) {
      const updatedUnits = [...(newEntry.units || [])];
      while (updatedUnits.length < newEntry.descriptions.length) {
        updatedUnits.push('meter');
      }
      setNewEntry({ ...newEntry, units: updatedUnits });
    }
  }, [newEntry.descriptions.length]);

  const handleAddRow = () => {
    setNewEntry({
      ...newEntry,
      descriptions: [...newEntry.descriptions, ''],
      quantities: [...newEntry.quantities, ''],
      price_per_meter: [...newEntry.price_per_meter, ''],
      units: [...(newEntry.units || []), 'meter']
    });
  };

  const handleRemoveRow = (index: number) => {
    if (newEntry.descriptions.length <= 1) {
      return; // Don't remove the last row
    }
    
    const updatedDescriptions = newEntry.descriptions.filter((_, i) => i !== index);
    const updatedQuantities = newEntry.quantities.filter((_, i) => i !== index);
    const updatedPricePerMtr = newEntry.price_per_meter.filter((_, i) => i !== index);
    const updatedUnits = (newEntry.units || []).filter((_, i) => i !== index);
    
    setNewEntry({
      ...newEntry,
      descriptions: updatedDescriptions,
      quantities: updatedQuantities,
      price_per_meter: updatedPricePerMtr,
      units: updatedUnits
    });
  };

  const handleChange = (
    field: 'descriptions' | 'quantities' | 'price_per_meter' | 'units', 
    index: number, 
    value: string
  ) => {
    const updatedField = [...(newEntry[field] || [])];
    updatedField[index] = value;

    if (field === 'quantities' || field === 'price_per_meter') {
      const updatedQuantities = [...newEntry.quantities];
      const updatedPricePerMeter = [...newEntry.price_per_meter];

      if (field === 'quantities') updatedQuantities[index] = value;
      if (field === 'price_per_meter') updatedPricePerMeter[index] = value;

      const newDebits = updatedQuantities.map((quantity, i) => Number(quantity || 0) * Number(updatedPricePerMeter[i] || 0));
      const totalDebit = newDebits.reduce((acc, debit) => acc + debit, 0);
      setNewEntry({
        ...newEntry,
        [field]: updatedField,
        debit: totalDebit
      });
    } else {
      setNewEntry({
        ...newEntry,
        [field]: updatedField
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.date || !newEntry.vendor_name || !newEntry.challan_no || 
        !newEntry.payment_method ||
        newEntry.descriptions.some(d => !d) ||
        newEntry.quantities.some(q => !q) ||
        newEntry.price_per_meter.some(p => !p) ||
        (newEntry.payment_method === 'cheque' && !newEntry.cheque_number)) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave();
  };

  // Ensure units array exists and matches descriptions length
  if (!newEntry.units || newEntry.units.length !== newEntry.descriptions.length) {
    const updatedUnits = Array(newEntry.descriptions.length).fill('meter');
    setNewEntry({ ...newEntry, units: updatedUnits });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            placeholder="Date"
            value={newEntry.date || ''}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
            required
          />
          <Select
            value={newEntry.vendor_name || ''}
            onValueChange={(value) => setNewEntry({ ...newEntry, vendor_name: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Company Name" />
            </SelectTrigger>
            <SelectContent>
              {vendors.map((vendor: Vendor, index: number) => (
                <SelectItem key={index} value={vendor.company_name}>
                  {vendor.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Debit"
            value={newEntry.debit || ''}
            disabled
          />
          <Input
            type="number"
            placeholder="Credit"
            value={newEntry.credit || ''}
            onChange={(e) => setNewEntry({ ...newEntry, credit: Number(e.target.value) })}
          />
          <Input
            placeholder="Challan No"
            value={newEntry.challan_no || ''}
            onChange={(e) => setNewEntry({ ...newEntry, challan_no: e.target.value })}
            required
          />
          <div className="space-y-2">
            <Select
              value={newEntry.payment_method || ''}
              onValueChange={(value) => setNewEntry({ ...newEntry, payment_method: value })}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>

            {newEntry.payment_method === 'cheque' && (
              <Input
                placeholder="Cheque Number"
                value={newEntry.cheque_number || ''}
                onChange={(e) => setNewEntry({ ...newEntry, cheque_number: e.target.value })}
                required
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          {newEntry.descriptions.map((description, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-4">
              <Input
                value={newEntry.descriptions[idx] || ''}
                placeholder="Description"
                onChange={(e) => handleChange('descriptions', idx, e.target.value)}
              />
              <Input
                type="number"
                value={newEntry.quantities[idx] || ''}
                placeholder="Quantity"
                onChange={(e) => handleChange('quantities', idx, e.target.value)}
              />
              <Select
                value={newEntry.units?.[idx] || 'meter'}
                onValueChange={(value) => handleChange('units', idx, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meter">Meter</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={newEntry.price_per_meter[idx] || ''}
                placeholder={newEntry.units?.[idx] === 'box' ? "Price per Box" : "Price per Meter"}
                onChange={(e) => handleChange('price_per_meter', idx, e.target.value)}
              />
              <Button 
                type="button"
                onClick={() => handleRemoveRow(idx)} 
                variant="destructive"
                disabled={newEntry.descriptions.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button 
            type="button" 
            className="bg-black text-white hover:bg-gray-200" 
            onClick={handleAddRow}
          >
            Add More
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full bg-black text-white hover:bg-gray-200"
        >
          Save Entry
        </Button>
      </div>
    </form>
  );
};

export default LedgerEntryForm;
