
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Plus, Trash2, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { ledgerApi } from '@/services/api'
import { Fonts } from '@/utils/Font.jsx'
import { useIsMobile } from '@/hooks/use-mobile'

interface Vendor {
  id?: number
  company_name: string
  supplier_name: string
  phone_no: string
  balance: number
}

interface LedgerEntry {
  date: string
  vendor_name: string
  phone_no?: string
  challan_no: string
  debit: number
  credit?: number
  balance: number
  payment_method: string
  cheque_number?: string
  descriptions: string[]
  quantities: number[]
  price_per_meters: string[]
  units?: string[]
}

interface NewLedgerEntry {
  descriptions: string[]
  quantities: string[]
  price_per_meter: string[]
  units?: string[]
  date: string
  vendor_name: string
  phone_no?: string
  challan_no: string
  debit: string | number
  credit: string | number
  balance: string | number
  payment_method: string
  cheque_number?: string
}

const LedgerManagement = () => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const vendorsPerPage = 10
  const [newEntry, setNewEntry] = useState<NewLedgerEntry>({
    descriptions: [''],
    quantities: [''],
    price_per_meter: [''],
    units: ['meter'],
    date: '',
    vendor_name: '',
    phone_no: '',
    challan_no: '',
    debit: '',
    credit: '',
    balance: '',
    payment_method: ''
  })

  const {
    data: ledgerData = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['ledgers'],
    queryFn: async () => {
      try {
        const data = await ledgerApi.getAllLedgers()
        console.log('Fetched ledger data:', data);
        return data
      } catch (error) {
        console.error('Error fetching ledgers:', error)
        throw error
      }
    }
  })

  // Ensure ledger is always an array
  const ledger: Vendor[] = Array.isArray(ledgerData?.companies) ? ledgerData.companies : []
  console.log('Processed ledger array:', ledger);

  const addLedgerMutation = useMutation({
    mutationFn: (newEntry: LedgerEntry) => ledgerApi.addLedgerEntry(newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledgers'] })
      toast({
        title: 'Success',
        description: 'Ledger entry added successfully'
      })
      setIsDialogOpen(false)
      setNewEntry({
        descriptions: [''],
        quantities: [''],
        price_per_meter: [''],
        units: ['meter'],
        date: '',
        vendor_name: '',
        phone_no: '',
        challan_no: '',
        debit: '',
        credit: '',
        balance: '',
        payment_method: ''
      })
    },
    onError: (error: any) => {
      console.log(error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message,
        variant: 'destructive'
      })
    }
  })

  const handleSave = () => {
    const cleanedDescriptions = newEntry.descriptions.filter((d) => d !== '')
    const cleanedQuantities = newEntry.quantities.filter((q) => q !== '').map((q) => Number(q))
    const cleanedPricePerMeter = newEntry.price_per_meter
      .filter((p) => p !== '')
      .map((p) => p.replace('$', ''))
    const cleanedUnits = (newEntry.units || []).filter((_, i) => 
      newEntry.descriptions[i] !== '' && 
      newEntry.quantities[i] !== '' && 
      newEntry.price_per_meter[i] !== ''
    )

    const debits = cleanedQuantities.map(
      (quantity, index) => quantity * Number(cleanedPricePerMeter[index])
    )
    const balance = newEntry.credit
      ? debits.reduce((acc, debit) => acc + debit, 0) - Number(newEntry.credit)
      : debits.reduce((acc, debit) => acc + debit, 0)

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
      units: cleanedUnits,
      cheque_number: newEntry.cheque_number
    }

    addLedgerMutation.mutate(entryData)
  }

  const handleViewDetails = (entry: Vendor) => {
    if (entry.company_name) {
      navigate(`/vendor-detail/${entry.company_name}`)
    } else {
      console.log('Slug is undefined for this entry')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching ledger entries.</div>
  }

  const handleAddRow = () => {
    setNewEntry({
      ...newEntry,
      descriptions: [...newEntry.descriptions, ''],
      quantities: [...newEntry.quantities, ''],
      price_per_meter: [...newEntry.price_per_meter, ''],
      units: [...(newEntry.units || []), 'meter']
    })
  }

  const handleRemoveRow = (index: number) => {
    // Don't remove the last row
    if (newEntry.descriptions.length === 1) {
      return;
    }
    
    const updatedDescriptions = newEntry.descriptions.filter((_, i) => i !== index)
    const updatedQuantities = newEntry.quantities.filter((_, i) => i !== index)
    const updatedPricePerMtr = newEntry.price_per_meter.filter((_, i) => i !== index)
    const updatedUnits = (newEntry.units || []).filter((_, i) => i !== index)
    
    setNewEntry({
      ...newEntry,
      descriptions: updatedDescriptions,
      quantities: updatedQuantities,
      price_per_meter: updatedPricePerMtr,
      units: updatedUnits
    })
  }

  const handleChange = (
    field: 'descriptions' | 'quantities' | 'price_per_meter' | 'units',
    index: number,
    value: string
  ) => {
    const updatedField = [...(newEntry[field] || [])]
    updatedField[index] = value

    if (field === 'quantities' || field === 'price_per_meter') {
      const updatedQuantities = [...newEntry.quantities]
      const updatedPricePerMeter = [...newEntry.price_per_meter]

      if (field === 'quantities') updatedQuantities[index] = value
      if (field === 'price_per_meter') updatedPricePerMeter[index] = value

      const newDebits = updatedQuantities.map(
        (quantity, i) => Number(quantity || 0) * Number(updatedPricePerMeter[i] || 0)
      )
      const totalDebit = newDebits.reduce((acc, debit) => acc + debit, 0)
      setNewEntry({
        ...newEntry,
        [field]: updatedField,
        debit: totalDebit
      })
    } else {
      setNewEntry({
        ...newEntry,
        [field]: updatedField
      })
    }
  }

  const filteredVendors = ledger.filter(
    (vendor) =>
      vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.phone_no.includes(searchTerm)
  )

  // Ensure pagination works on filtered data
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage)
  const indexOfLastVendor = currentPage * vendorsPerPage
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to the first page whenever the search term changes
  }
  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col justify-center items-center sm:flex-row lg:justify-between lg:items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold" style={{ ...Fonts.Poppins }}>
          Ledger Management
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild className="bg-black text-white hover:bg-gray-200">
            <Button
              onClick={() =>
                setNewEntry({
                  descriptions: [''],
                  quantities: [''],
                  price_per_meter: [''],
                  units: ['meter'],
                  date: '',
                  vendor_name: '',
                  challan_no: '',
                  debit: '',
                  credit: '',
                  balance: '',
                  payment_method: ''
                })
              }
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
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (
                  !newEntry.date ||
                  !newEntry.vendor_name ||
                  !newEntry.challan_no ||
                  !newEntry.payment_method ||
                  newEntry.descriptions.some((d) => !d) ||
                  newEntry.quantities.some((q) => !q) ||
                  newEntry.price_per_meter.some((p) => !p) ||
                  (newEntry.payment_method === 'cheque' && !newEntry.cheque_number)
                ) {
                  alert('Please fill in all required fields.')
                  return
                }
                handleSave()
              }}
            >
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
                      {ledger.map((vendor: Vendor, index: number) => (
                        <SelectItem key={index} value={vendor.company_name}>
                          {vendor.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Debit" value={newEntry.debit || ''} disabled />
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
                        onChange={(e) =>
                          setNewEntry({ ...newEntry, cheque_number: e.target.value })
                        }
                        required
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  {newEntry.descriptions.map((description, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-3">
                      <Input
                        value={newEntry.descriptions[idx]}
                        placeholder="Description"
                        onChange={(e) => handleChange('descriptions', idx, e.target.value)}
                      />
                      <Input
                        type="number"
                        value={newEntry.quantities[idx]}
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
                        value={newEntry.price_per_meter[idx]}
                        placeholder={newEntry.units?.[idx] === 'box' ? "Price per Box" : "Price per Meter"}
                        onChange={(e) => handleChange('price_per_meter', idx, e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        variant="destructive"
                        disabled={newEntry.descriptions.length === 1}
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

                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-200">
                  Save Entry
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by Company, Supplier, or Phone"
          className="pl-10"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>
                Company Name
              </TableHead>
              <TableHead style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>
                Supplier Name
              </TableHead>
              <TableHead style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>
                Phone Number
              </TableHead>
              <TableHead style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>
                Balance
              </TableHead>
              <TableHead style={{ ...Fonts.Poppins, fontSize: isMobile ? '12px' : '16px' }}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentVendors.map((vendor: Vendor, index: number) => (
              <TableRow key={index}>
                <TableCell style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}>
                {vendor.company_name.charAt(0).toUpperCase() + vendor.company_name.slice(1)}
                </TableCell>
                <TableCell style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}>
                {vendor.supplier_name.charAt(0).toUpperCase() + vendor.supplier_name.slice(1)}
                </TableCell>
                <TableCell style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}>
                  {vendor.phone_no}
                </TableCell>
                <TableCell style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}>
                  {Number(vendor.balance).toLocaleString('ur-PK')}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleViewDetails(vendor)}
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
      </Card>

      <div className="flex justify-end mt-4 space-x-2">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2"
          style={{ ...Fonts.Inter }}
        >
          Previous
        </Button>
        <div className="flex items-center space-x-2">
          <span style={{ ...Fonts.Inter }}>Page</span>
          <span className="font-semibold" style={{ ...Fonts.Inter }}>
            {currentPage}
          </span>
          <span style={{ ...Fonts.Inter }}>of {totalPages}</span>
        </div>
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2"
          style={{ ...Fonts.Inter }}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default LedgerManagement
