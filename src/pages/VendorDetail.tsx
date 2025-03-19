import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ledgerApi } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ArrowLeft, Plus, Edit, Trash2, Trash, Download } from 'lucide-react'
import { Fonts } from '@/utils/Font.jsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useIsMobile } from '@/hooks/use-mobile'
import { FaRegFilePdf } from "react-icons/fa6";
import { TbFileExcel } from "react-icons/tb";
import { VendorLedgerEntry, NewLedgerEntry, LedgerAPIResponse } from '@/types/vendor'

const VendorDetail: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { slug } = useParams<{ slug: string }>()
  const { toast } = useToast()
  const isMobile = useIsMobile()
  
  const [entries, setEntries] = useState<VendorLedgerEntry[]>([])
  const [vendorTitle, setVendorTitle] = useState('')

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<VendorLedgerEntry | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editingEntry, setEditingEntry] = useState<VendorLedgerEntry | null>(null)

  const [newEntry, setNewEntry] = useState<NewLedgerEntry>({
    date: new Date().toISOString().split('T')[0],
    challanNo: '',
    debit: '',
    credit: '',
    paymentMethod: 'cash',
    vendorName: '',
    descriptions: [''],
    quantities: [''],
    price_per_meter: [''],
    units: ['meter']
  })

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useQuery({
    queryKey: ['ledgers'],
    queryFn: async () => {
      const data = await ledgerApi.getAllLedgers()
      return data
    }
  })

  const { data: vendorData } = useQuery<LedgerAPIResponse>({
    queryKey: ['vendor-ledgers', slug],
    queryFn: () => ledgerApi.getLedgersByCompany(slug as string),
    enabled: !!slug
  })

  useEffect(() => {
    if (vendorData && vendorData.ledgers) {
      const updated = vendorData.ledgers.map((entry) => {
        const date = entry.date ? entry.date.split('T')[0] : '';
        const descriptions = entry.description ? entry.description.split(',') : [];
        const quantities = entry.quantity ? entry.quantity.split(',') : [];
        const prices = entry.price_per_meter ? entry.price_per_meter.split(',') : [];
        
        let units: string[] = [];
        if (entry.units) {
          units = Array.isArray(entry.units) ? entry.units : entry.units.split(',');
        } else {
          units = Array(descriptions.length).fill('meter');
        }

        return {
          ...entry,
          date,
          descriptions,
          quantities,
          prices,
          units
        };
      });
      setEntries(updated.reverse())
      if (updated.length > 0) {
        setVendorTitle(updated[0].company_name || slug || '')
      } else {
        setVendorTitle(slug || '')
      }
    }
  }, [vendorData, slug])

  const createMutation = useMutation({
    mutationFn: (entryData: any) => ledgerApi.addLedgerEntry(entryData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['vendor-ledgers', slug] })
      toast({ title: 'Success', description: 'Entry added successfully' })
      resetForm()
    },
    onError: (err: any) => {
      console.error('Failed to create entry:', err)
      toast({
        title: 'Error',
        description: 'Failed to create entry',
        variant: 'destructive'
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => ledgerApi.updateLedgerEntry(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['vendor-ledgers', slug] })
      toast({ title: 'Success', description: 'Entry updated successfully' })
      resetForm()
    },
    onError: (err: any) => {
      console.error('Failed to update entry:', err)
      toast({
        title: 'Error',
        description: 'Failed to update entry',
        variant: 'destructive'
      })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (entryId: string) => ledgerApi.deleteLedgerEntry(entryId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['vendor-ledgers', slug] })
      toast({ title: 'Success', description: 'Entry deleted successfully' })
      setIsDeleteDialogOpen(false)
      setEntryToDelete(null)
    },
    onError: (err: any) => {
      console.error('Error deleting entry:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete entry',
        variant: 'destructive'
      })
    }
  })

  const handleDeleteConfirmation = (entry: VendorLedgerEntry) => {
    setEntryToDelete(entry)
    setIsDeleteDialogOpen(true)
  }
  
  const handleDelete = () => {
    if (entryToDelete) {
      deleteMutation.mutate(entryToDelete.id)
    }
  }

  const handleEditEntry = (entry: VendorLedgerEntry) => {
    setIsEditing(true)
    setEditingEntry(entry)
    setNewEntry({
      date: entry.date || new Date().toISOString().split('T')[0],
      challanNo: entry.challan_no || '',
      descriptions: entry.descriptions || [''],
      quantities: entry.quantities || [''],
      price_per_meter: entry.prices || [''],
      units: entry.units || ['meter'],
      debit: entry.debit || '',
      credit: entry.credit || '',
      paymentMethod: entry.payment_method || 'cash',
      vendorName: entry.vendor_name || ''
    })
    setIsDialogOpen(true)
  }

  const handleOpenCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }
  
  const exportToExcel = () => {
    const startTimestamp = startDate ? new Date(startDate).getTime() : null;
    const endTimestamp = endDate ? new Date(endDate).getTime() : null;
  
    const filteredEntries = entries.filter(entry => {
      const entryTimestamp = new Date(entry.date).getTime();
  
      if (startTimestamp && endTimestamp) {
        return entryTimestamp >= startTimestamp && entryTimestamp <= endTimestamp;
      }
      return true;
    });
  
    if (filteredEntries.length === 0) {
      toast({
        title: 'No Data',
        description: 'No ledger entries found for the selected date range',
        variant: 'destructive'
      });
      return;
    }
  
    const totalDebit = filteredEntries.reduce((total, entry) => total + parseFloat(String(entry.debit || 0)), 0);
    const totalCredit = filteredEntries.reduce((total, entry) => total + parseFloat(String(entry.credit || 0)), 0);
    const totalBalance = totalDebit - totalCredit;
  
    const headers = [
      'Date',
      'Challan No',
      'Description',
      'Quantity',
      'Price per Meter',
      'Debit',
      'Credit',
      'Payment Method',
      'Balance'
    ];
  
    const excelData = filteredEntries.flatMap(entry =>
      (entry.descriptions || []).map((desc, rowIndex) => ({
        Date: rowIndex === 0 ? entry.date : '',
        'Challan No': rowIndex === 0 ? entry.challan_no : '',
        Description: desc,
        Quantity: entry.quantities?.[rowIndex] || '',
        'Price per Meter': entry.prices?.[rowIndex] || '',
        Debit: rowIndex === 0 ? entry.debit : '',
        Credit: rowIndex === 0 ? entry.credit : '',
        'Payment Method': rowIndex === 0 ? entry.payment_method : '',
        Balance: rowIndex === 0 ? entry.balance : ''
      }))
    );
  
    excelData.push({
      Date: '',
      'Challan No': '',
      Description: '',
      Quantity: '',
      'Price per Meter': '',
      Debit: '',
      Credit: '',
      'Payment Method': '',
      Balance: ''
    });
  
    excelData.push({
      Date: 'Total',
      'Challan No': '',
      Description: '',
      Quantity: '',
      'Price per Meter': '',
      Debit: totalDebit.toFixed(2),
      Credit: totalCredit.toFixed(2),
      'Payment Method': '',
      Balance: totalBalance.toFixed(2)
    });
  
    const worksheet = XLSX.utils.json_to_sheet([headers, ...excelData.map(obj => Object.values(obj))], { skipHeader: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ledger Report');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    const fileName = startDate && endDate
      ? `${slug} Ledger_Report_${startDate}_to_${endDate}.xlsx`
      : `${slug} Ledger_Report_All_Data.xlsx`;
  
    saveAs(data, fileName);
  
    toast({
      title: 'Success',
      description: 'Excel report downloaded successfully'
    });
  };

  const handleDownloadReport = async () => {
    try {
      if (!slug) {
        toast({
          title: 'Error',
          description: 'Vendor name is missing',
          variant: 'destructive'
        })
        return
      }

      const url = `http://localhost:5000/ledger-report/${encodeURIComponent(slug)}?format=pdf&start_date=${startDate}&end_date=${endDate}`

      const response = await fetch(url)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error fetching PDF:', errorText)
        throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `ledger-report-${slug}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)

      toast({
        title: 'Success',
        description: 'Report downloaded successfully'
      })
    } catch (error) {
      console.error('Failed to download PDF:', error)
      toast({
        title: 'Error',
        description: 'Failed to download report',
        variant: 'destructive'
      })
    }
  }

  const handleFormSubmit = () => {
    if (
      !newEntry.date ||
      !newEntry.challanNo ||
      !newEntry.paymentMethod ||
      newEntry.descriptions.some((d) => !d) ||
      newEntry.quantities.some((q) => !q) ||
      newEntry.price_per_meter.some((p) => !p)
    ) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      })
      return
    }

    try {
      const vendorName = vendorData?.ledgers?.[0]?.company_name || newEntry.vendorName || slug || '';
      if (!vendorName) throw new Error('Company name not found');

      const cleanedDescriptions = newEntry.descriptions.filter((d) => d !== '');
      const cleanedQuantities = newEntry.quantities
        .filter((q) => q !== '')
        .map((q) => Number(q));
      const cleanedPricePerMeter = newEntry.price_per_meter
        .filter((p) => p !== '')
        .map((p) => p.replace('$', ''));
      
      const cleanedUnits = newEntry.units.slice(0, cleanedDescriptions.length);
      
      while (cleanedUnits.length < cleanedDescriptions.length) {
        cleanedUnits.push('meter');
      }

      const debitsArr = cleanedQuantities.map(
        (quantity, idx) => quantity * Number(cleanedPricePerMeter[idx])
      )
      const totalDebit = debitsArr.reduce((acc, val) => acc + val, 0);
      const creditNum = Number(newEntry.credit) || 0;
      const balance = totalDebit - creditNum;

      const entryData = {
        date: newEntry.date,
        vendor_name: vendorName,
        challan_no: newEntry.challanNo,
        debit: totalDebit,
        credit: creditNum,
        balance,
        payment_method: newEntry.paymentMethod,
        descriptions: cleanedDescriptions,
        quantities: cleanedQuantities,
        price_per_meters: cleanedPricePerMeter,
        units: cleanedUnits
      };

      if (isEditing && editingEntry) {
        updateMutation.mutate({ id: editingEntry.id, data: entryData })
      } else {
        createMutation.mutate(entryData)
      }
    } catch (error) {
      console.error('Failed to save entry:', error)
      toast({
        title: 'Error',
        description: 'Failed to save entry.',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      challanNo: '',
      debit: '',
      credit: '',
      paymentMethod: 'cash',
      vendorName: '',
      descriptions: [''],
      quantities: [''],
      price_per_meter: [''],
      units: ['meter']
    })
    setIsEditing(false)
    setEditingEntry(null)
    setIsDialogOpen(false)
  }

  const handleChange = (field: keyof Pick<NewLedgerEntry, 'descriptions' | 'quantities' | 'price_per_meter'>, index: number, value: string) => {
    setNewEntry((prev) => {
      const copy = { ...prev }
      copy[field][index] = value
      return copy
    })
    updateDebit()
  }

  const handleAddRow = () => {
    setNewEntry((prev) => ({
      ...prev,
      descriptions: [...prev.descriptions, ''],
      quantities: [...prev.quantities, ''],
      price_per_meter: [...prev.price_per_meter, ''],
      units: [...prev.units, 'meter']
    }))
  }

  const handleRemoveRow = (idx: number) => {
    setNewEntry((prev) => {
      const copy = { ...prev }
      copy.descriptions.splice(idx, 1)
      copy.quantities.splice(idx, 1)
      copy.price_per_meter.splice(idx, 1)
      copy.units.splice(idx, 1)
      return copy
    })
    updateDebit()
  }

  const updateDebit = () => {
    const cleanedQuantities = newEntry.quantities.filter((q) => q !== '').map((q) => Number(q))
    const cleanedPricePerMeter = newEntry.price_per_meter
      .filter((p) => p !== '')
      .map((p) => p.replace('$', ''))
    const debits = cleanedQuantities.map(
      (quantity, index) => quantity * Number(cleanedPricePerMeter[index])
    )
    const totalDebit = debits.reduce((acc, debit) => acc + debit, 0)
    setNewEntry((prev) => ({ ...prev, debit: totalDebit }))
  }

  const filteredEntries = useMemo(() => {
    if (!entries || entries.length === 0) return []
    return entries.filter((entry) => {
      const entryTime = new Date(entry.date).getTime()
      const startTime = startDate ? new Date(startDate).getTime() : null
      const endTime = endDate ? new Date(endDate).getTime() : null

      if (startTime && entryTime < startTime) return false
      if (endTime && entryTime > endTime) return false
      return true
    })
  }, [entries, startDate, endDate])

  const totalDebit = entries.reduce((total, entry) => total + parseFloat(String(entry.debit || 0)), 0)
  const totalCredit = entries.reduce((total, entry) => total + parseFloat(String(entry.credit || 0)), 0)

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage)
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6" style={{ ...Fonts.Poppins }}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card style={{ boxShadow: '4px 4px 15px 4px rgba(0, 0, 0, 0.05)' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ ...Fonts.Poppins }}>
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ ...Fonts.Poppins }}>
              {entries.length}
            </div>
          </CardContent>
        </Card>
        <Card style={{ boxShadow: '4px 4px 15px 4px rgba(0, 0, 0, 0.05)' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ ...Fonts.Poppins }}>
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ ...Fonts.Poppins }}>
              Rs {Math.abs(totalDebit - totalCredit).toLocaleString('ur-PK')}
            </div>
          </CardContent>
        </Card>
        <Card style={{ boxShadow: '4px 4px 15px 4px rgba(0, 0, 0, 0.05)' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ ...Fonts.Poppins }}>
              Total Debit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ ...Fonts.Poppins }}>
              Rs {totalDebit.toLocaleString('ur-PK')}
            </div>
          </CardContent>
        </Card>
        <Card style={{ boxShadow: '4px 4px 15px 4px rgba(0, 0, 0, 0.05)' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ ...Fonts.Poppins }}>
              Total Credit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ ...Fonts.Poppins }}>
              Rs {totalCredit.toLocaleString('ur-PK')}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center py-4 justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">{vendorTitle || 'Loading Vendor...'}</h1>
          <Button
            onClick={handleDownloadReport}
            variant="default"
            className="bg-black text-white hover:bg-gray-200 hover:text-white"
          >
            <FaRegFilePdf className="w-4 h-4" />
          </Button>
          <Button
            onClick={exportToExcel}
            variant="default"
            className="bg-black text-white hover:bg-gray-200 hover:text-white"
          >
            <TbFileExcel  />
          </Button>
        </div>
        <Button
          variant="default"
          onClick={handleOpenCreateDialog}
          className="bg-black text-white hover:bg-gray-200 hover:text-white"
        >
          Add Entry
        </Button>
      </div>
      <div className="flex items-center pb-4 gap-2">
        <Input
          type="date"
          placeholder="Start date"
          value={startDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => {
            const selectedDate = e.target.value;
            if (new Date(selectedDate) <= new Date()) {
              setStartDate(selectedDate);
            }
          }}
        />
        <Input
          type="date"
          placeholder="End date"
          value={endDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => {
            const selectedDate = e.target.value;
            if (new Date(selectedDate) <= new Date()) {
              setEndDate(selectedDate);
            }
          }}
        />
      </div>
      <Card>
        <CardHeader />
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="text-center"
                  style={{ ...Fonts.Roboto, fontSize: isMobile ? '14px' : '16px' }}
                >
                  Date
                </TableHead>
                <TableHead
                  className="text-center"
                  style={{ ...Fonts.Roboto, fontSize: isMobile ? '14px' : '16px' }}
                >
                  Challan No
                </TableHead>
                <TableHead
                  className="text-center"
                  style={{ ...Fonts.Roboto, fontSize: isMobile ? '14px' : '16px' }}
                >
                  Description
                </TableHead>
                <TableHead
                  className="text-center"
                  style={{ ...Fonts.Roboto, fontSize: isMobile ? '14px' : '16px' }}
                >
                  Quantity
                </TableHead>
                <TableHead
                  className="text-center"
                  style={{ ...Fonts.Roboto, fontSize: isMobile ? '14px' : '16px' }}
                >
                  Price/Mtr
                </TableHead>
                <TableHead
                  className="text-center"
                  style={{ ...Fonts.Roboto, fontSize: isMobile ? '14px' : '16px' }}
                >
                  Debit
                </TableHead>
                <TableHead
                  className="text-center"
                  style={{ ...Fonts.Roboto, fontSize: isMobile ? '14px' : '16px' }}
                >
                  Credit
                </TableHead>
                <TableHead
                  className="text-center"
                  style={{ ...Fonts.Roboto, fontSize: isMobile ? '14px' : '16px' }}
                >
                  Payment Method
                </TableHead>
                <TableHead
                  className="text-center"
                  style={{ ...Fonts.Roboto, fontSize: isMobile ? '14px' : '16px' }}
                >
                  Balance
                </TableHead>
                <TableHead
                  className="text-center"
                  style={{ ...Fonts.Roboto, fontSize: isMobile ? '14px' : '16px' }}
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEntries.length > 0 ? (
                paginatedEntries.map((entry) =>
                  entry.descriptions && entry.quantities && entry.prices ? (
                    entry.descriptions.map((desc, rowIndex) => (
                      <TableRow key={`${entry.id}-${rowIndex}`}>
                        {rowIndex === 0 && (
                          <TableCell rowSpan={entry.descriptions.length}>
                            {new Date(entry.date).toLocaleDateString()}
                          </TableCell>
                        )}
                        {rowIndex === 0 && (
                          <TableCell
                            rowSpan={entry.descriptions.length}
                            style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                          >
                            {entry.challan_no}
                          </TableCell>
                        )}
                        <TableCell
                          style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                        >
                          {desc}
                        </TableCell>
                        <TableCell
                          style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                        >
                          {entry.quantities[rowIndex]}
                        </TableCell>
                        <TableCell
                          style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                        >
                          {entry.prices[rowIndex]}
                        </TableCell>
                        {rowIndex === 0 && (
                          <TableCell
                            rowSpan={entry.descriptions.length}
                            style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                          >
                            {Number(entry.debit || 0).toLocaleString('ur-PK')}
                          </TableCell>
                        )}
                        {rowIndex === 0 && (
                          <TableCell
                            rowSpan={entry.descriptions.length}
                            style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                          >
                            {Number(entry.credit || 0).toLocaleString('ur-PK')}
                          </TableCell>
                        )}
                        {rowIndex === 0 && (
                          <TableCell
                            rowSpan={entry.descriptions.length}
                            style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                          >
                            {entry.payment_method}
                          </TableCell>
                        )}
                        {rowIndex === 0 && (
                          <TableCell
                            rowSpan={entry.descriptions.length}
                            style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                          >
                            {Number(entry.balance || 0).toLocaleString('ur-PK')}
                          </TableCell>
                        )}
                        {rowIndex === 0 && (
                          <TableCell
                            rowSpan={entry.descriptions.length}
                            style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                          >
                            <Button
                              onClick={() => handleEditEntry(entry)}
                              style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteConfirmation(entry)}
                              style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow key={entry.id}>
                      <TableCell
                        colSpan={9}
                        style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                      >
                        No data available
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    style={{ ...Fonts.Roboto, fontSize: isMobile ? '12px' : '14px' }}
                  >
                    {entries.length === 0 ? 'Loading...' : 'No entries found for this date range.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild />
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Ledger Entry' : 'Add New Ledger Entry'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                value={newEntry.date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  const today = new Date();
                  if (selectedDate <= today) {
                    setNewEntry({ ...newEntry, date: e.target.value });
                  }
                }}
              />
              <Input
                type="text"
                placeholder="Vendor Name"
                disabled={vendorData?.ledgers && vendorData.ledgers.length > 0}
                value={vendorData?.ledgers?.[0]?.company_name || newEntry.vendorName || ''}
                onChange={(e) => setNewEntry({ ...newEntry, vendorName: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Debit"
                value={newEntry.debit}
                disabled
              />
              <Input
                type="number"
                placeholder="Credit"
                value={newEntry.credit}
                onChange={(e) => setNewEntry({ ...newEntry, credit: Number(e.target.value) })}
              />
              <Input
                placeholder="Challan No"
                value={newEntry.challanNo}
                onChange={(e) => setNewEntry({ ...newEntry, challanNo: e.target.value })}
              />
              <div className="space-y-2">
                <Select
                  value={newEntry.paymentMethod || ''}
                  onValueChange={(value) => setNewEntry({ ...newEntry, paymentMethod: value })}
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

                {newEntry.paymentMethod === 'cheque' && (
                  <Input
                    placeholder="Cheque Number"
                    value={newEntry.chequeNumber || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, chequeNumber: e.target.value })}
                    required
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              {newEntry.descriptions.map((desc, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4">
                  <Input
                    placeholder="Description"
                    value={desc}
                    onChange={(e) => handleChange('descriptions', idx, e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={newEntry.quantities[idx]}
                    onChange={(e) => handleChange('quantities', idx, e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Price per Meter"
                    value={newEntry.price_per_meter[idx]}
                    onChange={(e) => handleChange('price_per_meter', idx, e.target.value)}
                  />
                  <Button onClick={() => handleRemoveRow(idx)} variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAddRow}
                className="bg-black text-white hover:bg-gray-200 hover:text-white"
              >
                Add More
              </Button>
            </div>

            <Button
              onClick={handleFormSubmit}
              className="w-full bg-black text-white hover:bg-gray-200 hover:text-white"
            >
              {isEditing ? 'Update Entry' : 'Save Entry'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="min-w-[400px] h-[160px]">
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this entry?</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-11">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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

export default VendorDetail
