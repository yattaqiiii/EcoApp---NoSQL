"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Search, Eye, Award, TrendingUp, Loader2 } from "lucide-react"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    total_xp: "",
    level: "",
    badges: "",
  })

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("http://localhost:5000/api/admin/users")
      const result = await response.json()

      if (result.success) {
        setUsers(result.data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(user => user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase()))

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const goToPage = page => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleAdd = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          total_xp: parseInt(formData.total_xp) || 0,
          level: parseInt(formData.level) || 1,
          badges: formData.badges ? formData.badges.split(",").map(b => b.trim()) : [],
        }),
      })

      const result = await response.json()
      if (result.success) {
        await fetchUsers()
        setIsAddDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error adding user:", error)
      alert("Failed to add user")
    }
  }

  const handleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          total_xp: parseInt(formData.total_xp),
          level: parseInt(formData.level),
          badges: formData.badges.split(",").map(b => b.trim()),
        }),
      })

      const result = await response.json()
      if (result.success) {
        await fetchUsers()
        setIsEditDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Failed to update user")
    }
  }

  const handleDelete = async id => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()
      if (result.success) {
        await fetchUsers()
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Failed to delete user")
    }
  }

  const openEditDialog = user => {
    setSelectedUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      total_xp: user.total_xp.toString(),
      level: user.level.toString(),
      badges: user.badges.join(", "),
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = user => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      total_xp: "",
      level: "",
      badges: "",
    })
    setSelectedUser(null)
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  const getLevelBadgeColor = level => {
    if (level >= 7) return "bg-purple-100 text-purple-800"
    if (level >= 5) return "bg-blue-100 text-blue-800"
    if (level >= 3) return "bg-green-100 text-green-800"
    return "bg-slate-100 text-slate-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-600 mt-1">Manage user accounts and gamification</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{users.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600">Avg Level</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{users.length > 0 ? (users.reduce((sum, u) => sum + (u.level || 0), 0) / users.length).toFixed(1) : "0"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600">Total XP</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{users.reduce((sum, u) => sum + (u.total_xp || 0), 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600">Badges Earned</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{users.reduce((sum, u) => sum + u.badges.length, 0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search by username or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Total XP</TableHead>
                <TableHead>Badges</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
                    <p className="text-slate-500 mt-2">Loading users...</p>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                currentUsers.map(user => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell className="text-sm text-slate-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getLevelBadgeColor(user.level)}>Level {user.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-600">
                        <TrendingUp className="h-3 w-3" />
                        {user.total_xp.toLocaleString()} XP
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                        <Award className="h-3 w-3" />
                        {user.badges.length}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{formatDate(user.joined_at)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openViewDialog(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user._id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    if (page === 1 || page === totalPages) return true
                    if (Math.abs(page - currentPage) <= 1) return true
                    return false
                  })
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center gap-2">
                      {index > 0 && array[index - 1] !== page - 1 && <span className="text-slate-400">...</span>}
                      <Button variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => goToPage(page)} className={currentPage === page ? "bg-green-600 hover:bg-green-700" : ""}>
                        {page}
                      </Button>
                    </div>
                  ))}
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="John Doe" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_xp">Total XP</Label>
                <Input id="total_xp" type="number" placeholder="0" value={formData.total_xp} onChange={e => setFormData({ ...formData, total_xp: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Input id="level" type="number" placeholder="1" value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="badges">Badges (comma separated)</Label>
              <Input id="badges" placeholder="First Scan, Eco Warrior" value={formData.badges} onChange={e => setFormData({ ...formData, badges: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_username">Username</Label>
              <Input id="edit_username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_email">Email</Label>
              <Input id="edit_email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_total_xp">Total XP</Label>
                <Input id="edit_total_xp" type="number" value={formData.total_xp} onChange={e => setFormData({ ...formData, total_xp: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_level">Level</Label>
                <Input id="edit_level" type="number" value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_badges">Badges (comma separated)</Label>
              <Input id="edit_badges" value={formData.badges} onChange={e => setFormData({ ...formData, badges: e.target.value })} />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>User ID</Label>
                <p className="text-sm text-slate-600">{selectedUser._id}</p>
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <p className="text-sm font-medium">{selectedUser.username}</p>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm text-slate-600">{selectedUser.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Badge className={getLevelBadgeColor(selectedUser.level)}>Level {selectedUser.level}</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Total XP</Label>
                  <p className="text-sm font-medium text-orange-600">{selectedUser.total_xp.toLocaleString()} XP</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Badges ({selectedUser.badges.length})</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUser.badges.map((badge, index) => (
                    <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      <Award className="h-3 w-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Joined</Label>
                <p className="text-sm text-slate-600">{formatDate(selectedUser.joined_at)}</p>
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
