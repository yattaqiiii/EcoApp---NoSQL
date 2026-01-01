"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Search, Eye, MapPin, Trash } from "lucide-react"

export default function BinsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedBin, setSelectedBin] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    current_fill: "",
    waste_type: "",
    status: "",
    coordinates: "",
    description: "",
  })

  // Dummy data
  const [bins, setBins] = useState([
    {
      _id: "bin_001",
      name: "Tempat Sampah A1",
      location: "Fakultas MIPA - Gedung Utama",
      capacity: 100,
      current_fill: 75,
      waste_type: "Plastik",
      status: "active",
      coordinates: { lat: -7.771389, lng: 110.377778 },
      description: "Tempat sampah khusus plastik di lantai 1",
      last_emptied: "2026-01-01T08:00:00Z",
      created_at: "2025-10-01T00:00:00Z",
    },
    {
      _id: "bin_002",
      name: "Tempat Sampah A2",
      location: "Fakultas MIPA - Gedung Utama",
      capacity: 100,
      current_fill: 30,
      waste_type: "Organik",
      status: "active",
      coordinates: { lat: -7.7714, lng: 110.3778 },
      description: "Tempat sampah organik di lantai 1",
      last_emptied: "2026-01-01T06:00:00Z",
      created_at: "2025-10-01T00:00:00Z",
    },
    {
      _id: "bin_003",
      name: "Tempat Sampah B1",
      location: "Fakultas MIPA - Lab Kimia",
      capacity: 80,
      current_fill: 90,
      waste_type: "Kertas",
      status: "full",
      coordinates: { lat: -7.7715, lng: 110.3779 },
      description: "Tempat sampah kertas di area lab",
      last_emptied: "2025-12-30T14:00:00Z",
      created_at: "2025-10-15T00:00:00Z",
    },
    {
      _id: "bin_004",
      name: "Tempat Sampah C1",
      location: "Fakultas MIPA - Kantin",
      capacity: 120,
      current_fill: 45,
      waste_type: "Organik",
      status: "active",
      coordinates: { lat: -7.7716, lng: 110.378 },
      description: "Tempat sampah organik di area kantin",
      last_emptied: "2026-01-01T10:00:00Z",
      created_at: "2025-10-01T00:00:00Z",
    },
    {
      _id: "bin_005",
      name: "Tempat Sampah D1",
      location: "Fakultas MIPA - Parkiran",
      capacity: 100,
      current_fill: 15,
      waste_type: "Logam",
      status: "maintenance",
      coordinates: { lat: -7.7717, lng: 110.3781 },
      description: "Tempat sampah logam - sedang perbaikan",
      last_emptied: "2025-12-31T12:00:00Z",
      created_at: "2025-11-01T00:00:00Z",
    },
  ])

  const wasteTypes = ["Plastik", "Organik", "Kertas", "Logam", "Kaca"]
  const statuses = ["active", "full", "maintenance", "inactive"]

  const filteredBins = bins.filter(bin => bin.name.toLowerCase().includes(searchTerm.toLowerCase()) || bin.location.toLowerCase().includes(searchTerm.toLowerCase()) || bin.waste_type.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAdd = () => {
    const coords = formData.coordinates.split(",").map(c => parseFloat(c.trim()))
    const newBin = {
      _id: `bin_${Date.now()}`,
      name: formData.name,
      location: formData.location,
      capacity: parseInt(formData.capacity),
      current_fill: parseInt(formData.current_fill) || 0,
      waste_type: formData.waste_type,
      status: formData.status,
      coordinates: { lat: coords[0] || 0, lng: coords[1] || 0 },
      description: formData.description,
      last_emptied: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    setBins([newBin, ...bins])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEdit = () => {
    const coords = formData.coordinates.split(",").map(c => parseFloat(c.trim()))
    setBins(
      bins.map(bin =>
        bin._id === selectedBin._id
          ? {
              ...bin,
              name: formData.name,
              location: formData.location,
              capacity: parseInt(formData.capacity),
              current_fill: parseInt(formData.current_fill),
              waste_type: formData.waste_type,
              status: formData.status,
              coordinates: { lat: coords[0], lng: coords[1] },
              description: formData.description,
            }
          : bin
      )
    )
    setIsEditDialogOpen(false)
    resetForm()
  }

  const handleDelete = id => {
    if (confirm("Are you sure you want to delete this bin?")) {
      setBins(bins.filter(bin => bin._id !== id))
    }
  }

  const handleEmptyBin = id => {
    setBins(
      bins.map(bin =>
        bin._id === id
          ? {
              ...bin,
              current_fill: 0,
              last_emptied: new Date().toISOString(),
              status: "active",
            }
          : bin
      )
    )
  }

  const openEditDialog = bin => {
    setSelectedBin(bin)
    setFormData({
      name: bin.name,
      location: bin.location,
      capacity: bin.capacity.toString(),
      current_fill: bin.current_fill.toString(),
      waste_type: bin.waste_type,
      status: bin.status,
      coordinates: `${bin.coordinates.lat}, ${bin.coordinates.lng}`,
      description: bin.description,
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = bin => {
    setSelectedBin(bin)
    setIsViewDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      capacity: "",
      current_fill: "",
      waste_type: "",
      status: "",
      coordinates: "",
      description: "",
    })
    setSelectedBin(null)
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  const getStatusBadge = status => {
    const styles = {
      active: "bg-green-100 text-green-800",
      full: "bg-red-100 text-red-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      inactive: "bg-slate-100 text-slate-800",
    }
    return styles[status] || styles.inactive
  }

  const getWasteTypeBadgeColor = type => {
    const colors = {
      Plastik: "bg-blue-100 text-blue-800",
      Organik: "bg-green-100 text-green-800",
      Kertas: "bg-yellow-100 text-yellow-800",
      Logam: "bg-gray-100 text-gray-800",
      Kaca: "bg-purple-100 text-purple-800",
    }
    return colors[type] || "bg-slate-100 text-slate-800"
  }

  const getFillPercentage = bin => {
    return Math.round((bin.current_fill / bin.capacity) * 100)
  }

  const getFillColor = percentage => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tempat Sampah</h1>
          <p className="text-slate-600 mt-1">Manage waste bins locations and capacity</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Bin
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600">Total Bins</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{bins.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600">Active</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{bins.filter(b => b.status === "active").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600">Full</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{bins.filter(b => b.status === "full").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600">Maintenance</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{bins.filter(b => b.status === "maintenance").length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search by name, location, or waste type..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Waste Bins ({filteredBins.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Waste Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Fill Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500">
                    No bins found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBins.map(bin => {
                  const fillPercentage = getFillPercentage(bin)
                  return (
                    <TableRow key={bin._id}>
                      <TableCell className="font-medium">{bin.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <MapPin className="h-3 w-3" />
                          {bin.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getWasteTypeBadgeColor(bin.waste_type)}>{bin.waste_type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {bin.current_fill} / {bin.capacity} L
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">{fillPercentage}%</span>
                          </div>
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <div className={`${getFillColor(fillPercentage)} h-2 rounded-full transition-all`} style={{ width: `${fillPercentage}%` }} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(bin.status)}>{bin.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openViewDialog(bin)} title="View details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEmptyBin(bin._id)} title="Empty bin" disabled={bin.current_fill === 0}>
                            <Trash className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(bin)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(bin._id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Waste Bin</DialogTitle>
            <DialogDescription>Add a new waste bin to the system</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Tempat Sampah A1" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waste_type">Waste Type</Label>
              <Select value={formData.waste_type} onValueChange={value => setFormData({ ...formData, waste_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {wasteTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Fakultas MIPA - Gedung Utama" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (Liters)</Label>
              <Input id="capacity" type="number" placeholder="100" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_fill">Current Fill (Liters)</Label>
              <Input id="current_fill" type="number" placeholder="0" value={formData.current_fill} onChange={e => setFormData({ ...formData, current_fill: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={value => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coordinates">Coordinates (lat, lng)</Label>
              <Input id="coordinates" placeholder="-7.771389, 110.377778" value={formData.coordinates} onChange={e => setFormData({ ...formData, coordinates: e.target.value })} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Additional information about this bin..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
              Add Bin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Waste Bin</DialogTitle>
            <DialogDescription>Update waste bin information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_name">Name</Label>
              <Input id="edit_name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_waste_type">Waste Type</Label>
              <Select value={formData.waste_type} onValueChange={value => setFormData({ ...formData, waste_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {wasteTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit_location">Location</Label>
              <Input id="edit_location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_capacity">Capacity (Liters)</Label>
              <Input id="edit_capacity" type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_current_fill">Current Fill (Liters)</Label>
              <Input id="edit_current_fill" type="number" value={formData.current_fill} onChange={e => setFormData({ ...formData, current_fill: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select value={formData.status} onValueChange={value => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_coordinates">Coordinates (lat, lng)</Label>
              <Input id="edit_coordinates" value={formData.coordinates} onChange={e => setFormData({ ...formData, coordinates: e.target.value })} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea id="edit_description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Waste Bin Details</DialogTitle>
          </DialogHeader>
          {selectedBin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Bin ID</Label>
                <p className="text-sm text-slate-600">{selectedBin._id}</p>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <p className="text-sm font-medium">{selectedBin.name}</p>
              </div>
              <div className="space-y-2">
                <Label>Waste Type</Label>
                <Badge className={getWasteTypeBadgeColor(selectedBin.waste_type)}>{selectedBin.waste_type}</Badge>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Location</Label>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedBin.location}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Capacity</Label>
                <p className="text-sm font-medium">{selectedBin.capacity} Liters</p>
              </div>
              <div className="space-y-2">
                <Label>Current Fill</Label>
                <p className="text-sm font-medium">
                  {selectedBin.current_fill} Liters ({getFillPercentage(selectedBin)}%)
                </p>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Badge className={getStatusBadge(selectedBin.status)}>{selectedBin.status}</Badge>
              </div>
              <div className="space-y-2">
                <Label>Coordinates</Label>
                <p className="text-sm text-slate-600">
                  {selectedBin.coordinates.lat}, {selectedBin.coordinates.lng}
                </p>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <p className="text-sm text-slate-600">{selectedBin.description}</p>
              </div>
              <div className="space-y-2">
                <Label>Last Emptied</Label>
                <p className="text-sm text-slate-600">{formatDate(selectedBin.last_emptied)}</p>
              </div>
              <div className="space-y-2">
                <Label>Created</Label>
                <p className="text-sm text-slate-600">{formatDate(selectedBin.created_at)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
