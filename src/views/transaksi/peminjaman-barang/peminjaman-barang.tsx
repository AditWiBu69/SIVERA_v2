'use client'

import React, { useState } from 'react'
import type { FormEvent } from 'react'
import { CSVLink } from 'react-csv'
import {
    PiHandshakeDuotone,
    PiCheckCircleDuotone,
    PiWarningCircleDuotone,
    PiDownloadSimpleDuotone,
    PiPlusBold,
    PiPencilSimpleLineDuotone,
    PiTrashDuotone,
} from 'react-icons/pi'
import { Dialog, Button, Input, Select, Form, FormItem, Notification, toast } from '@/components/ui'

// --- 1. Cetakan Data (Interface) untuk Transaksi Peminjaman Barang ---
interface PeminjamanItem {
    id: string
    noPeminjaman: string
    namaBarang: string
    peminjam: string
    tanggalPinjam: string
    tanggalKembali: string
    status: 'Dipinjam' | 'Dikembalikan' | 'Terlambat'
}

type StatusOption = { value: PeminjamanItem['status']; label: string }

const csvHeaders = [
    { label: 'No Peminjaman', key: 'noPeminjaman' },
    { label: 'Nama Barang', key: 'namaBarang' },
    { label: 'Peminjam', key: 'peminjam' },
    { label: 'Tanggal Pinjam', key: 'tanggalPinjam' },
    { label: 'Tanggal Kembali', key: 'tanggalKembali' },
    { label: 'Status', key: 'status' },
]

const statusOptions: StatusOption[] = [
    { value: 'Dipinjam', label: 'Dipinjam' },
    { value: 'Dikembalikan', label: 'Dikembalikan' },
    { value: 'Terlambat', label: 'Terlambat' },
]

const emptyForm = { noPeminjaman: '', namaBarang: '', peminjam: '', tanggalPinjam: '', tanggalKembali: '' }

// --- 2. Fungsi untuk Mewarnai Status (Badge) ---
const statusBadgeClass = (status: PeminjamanItem['status']) => {
    if (status === 'Dikembalikan') return 'bg-emerald-100 text-emerald-800'
    if (status === 'Dipinjam') return 'bg-purple-100 text-purple-800'
    return 'bg-rose-100 text-rose-800' // Terlambat
}

export default function PeminjamanBarangPanel() {
    // --- 3. Data Dummy (Transaksi Peminjaman Barang) ---
    const [data, setData] = useState<PeminjamanItem[]>([
        { id: '1', noPeminjaman: 'PJ-001', namaBarang: 'Kamera DSLR Canon', peminjam: 'Ekskul Fotografi', tanggalPinjam: '2026-09-01', tanggalKembali: '2026-09-08', status: 'Dikembalikan' },
        { id: '2', noPeminjaman: 'PJ-002', namaBarang: 'Proyektor Epson', peminjam: 'Kelas XII RPL', tanggalPinjam: '2026-09-10', tanggalKembali: '2026-09-12', status: 'Dipinjam' },
        { id: '3', noPeminjaman: 'PJ-003', namaBarang: 'Mikroskop', peminjam: 'Kelas XI MIPA', tanggalPinjam: '2026-08-20', tanggalKembali: '2026-08-27', status: 'Terlambat' },
        { id: '4', noPeminjaman: 'PJ-004', namaBarang: 'Laptop Asus ROG', peminjam: 'Guru TIK', tanggalPinjam: '2026-09-14', tanggalKembali: '2026-09-16', status: 'Dipinjam' },
    ])

    // --- 4. State untuk dialog Tambah/Edit (satu dialog, dibedakan lewat formMode) ---
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState(emptyForm)
    const [selectedStatus, setSelectedStatus] = useState<StatusOption>(statusOptions[0])

    // --- 5. State untuk dialog konfirmasi Hapus ---
    const [deleteTarget, setDeleteTarget] = useState<PeminjamanItem | null>(null)

    const openAddDialog = () => {
        setFormMode('add')
        setEditingId(null)
        setFormData(emptyForm)
        setSelectedStatus(statusOptions[0])
        setIsFormDialogOpen(true)
    }

    const openEditDialog = (item: PeminjamanItem) => {
        setFormMode('edit')
        setEditingId(item.id)
        setFormData({
            noPeminjaman: item.noPeminjaman,
            namaBarang: item.namaBarang,
            peminjam: item.peminjam,
            tanggalPinjam: item.tanggalPinjam,
            tanggalKembali: item.tanggalKembali,
        })
        setSelectedStatus(statusOptions.find((opt) => opt.value === item.status) ?? statusOptions[0])
        setIsFormDialogOpen(true)
    }

    const closeFormDialog = () => setIsFormDialogOpen(false)

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formMode === 'edit' && editingId) {
            setData((prev) =>
                prev.map((item) =>
                    item.id === editingId
                        ? {
                              ...item,
                              noPeminjaman: formData.noPeminjaman,
                              namaBarang: formData.namaBarang,
                              peminjam: formData.peminjam,
                              tanggalPinjam: formData.tanggalPinjam,
                              tanggalKembali: formData.tanggalKembali,
                              status: selectedStatus.value,
                          }
                        : item,
                ),
            )
            toast.push(
                <Notification type="success" title="Data diperbarui">
                    Data peminjaman barang berhasil diubah.
                </Notification>,
            )
        } else {
            const newItem: PeminjamanItem = {
                id: `PJ-${Date.now()}`,
                noPeminjaman: formData.noPeminjaman,
                namaBarang: formData.namaBarang,
                peminjam: formData.peminjam,
                tanggalPinjam: formData.tanggalPinjam,
                tanggalKembali: formData.tanggalKembali,
                status: selectedStatus.value,
            }
            setData((prev) => [newItem, ...prev])
            toast.push(
                <Notification type="success" title="Data ditambahkan">
                    Data peminjaman barang baru berhasil disimpan.
                </Notification>,
            )
        }

        closeFormDialog()
    }

    const confirmDelete = (item: PeminjamanItem) => setDeleteTarget(item)
    const cancelDelete = () => setDeleteTarget(null)

    const handleDelete = () => {
        if (!deleteTarget) return
        setData((prev) => prev.filter((item) => item.id !== deleteTarget.id))
        toast.push(
            <Notification type="success" title="Data dihapus">
                Data peminjaman &quot;{deleteTarget.noPeminjaman}&quot; telah dihapus.
            </Notification>,
        )
        setDeleteTarget(null)
    }

    // Perhitungan otomatis dari data
    const totalPeminjaman = data.length
    const sedangDipinjam = data.filter((item) => item.status === 'Dipinjam').length
    const jumlahTerlambat = data.filter((item) => item.status === 'Terlambat').length

    return (
        <div className="p-6">
            {/* --- Bagian Header & Tombol --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Transaksi Peminjaman Barang</h2>
                    <p className="text-gray-500 mt-1">
                        Catat dan pantau peminjaman barang inventaris sekolah.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="solid" icon={<PiPlusBold />} onClick={openAddDialog}>
                        Tambah Data
                    </Button>

                    <CSVLink
                        data={data}
                        headers={csvHeaders}
                        filename={`peminjaman-barang-${new Date().toISOString().slice(0, 10)}.csv`}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
                    >
                        <PiDownloadSimpleDuotone className="text-xl" />
                        <span>Export Data</span>
                    </CSVLink>
                </div>
            </div>

            {/* --- Kartu Ringkasan (Metrik) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                        <PiHandshakeDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Peminjaman</p>
                        <h3 className="text-3xl font-bold text-gray-800">{totalPeminjaman}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
                        <PiCheckCircleDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Sedang Dipinjam</p>
                        <h3 className="text-3xl font-bold text-gray-800">{sedangDipinjam}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-rose-50 text-rose-600 rounded-full">
                        <PiWarningCircleDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Terlambat</p>
                        <h3 className="text-3xl font-bold text-gray-800">{jumlahTerlambat}</h3>
                    </div>
                </div>
            </div>

            {/* --- Tabel Rincian Peminjaman --- */}
            <div className="mt-2">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Rincian Peminjaman Barang</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-900">No Peminjaman</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Nama Barang</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Peminjam</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Tgl Pinjam</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Tgl Kembali</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-900 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{item.noPeminjaman}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.namaBarang}</td>
                                    <td className="px-6 py-4 text-gray-700">{item.peminjam}</td>
                                    <td className="px-6 py-4 text-gray-700">{item.tanggalPinjam}</td>
                                    <td className="px-6 py-4 text-gray-700">{item.tanggalKembali}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(item.status)}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                shape="circle"
                                                variant="plain"
                                                size="sm"
                                                onClick={() => openEditDialog(item)}
                                                icon={<PiPencilSimpleLineDuotone className="text-lg text-blue-600" />}
                                            />
                                            <Button
                                                shape="circle"
                                                variant="plain"
                                                size="sm"
                                                onClick={() => confirmDelete(item)}
                                                icon={<PiTrashDuotone className="text-lg text-red-600" />}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Dialog Form Tambah/Edit --- */}
            <Dialog isOpen={isFormDialogOpen} onClose={closeFormDialog} onRequestClose={closeFormDialog} width={640}>
                <h4 className="mb-4">
                    {formMode === 'edit' ? 'Ubah Data Peminjaman' : 'Tambah Data Peminjaman'}
                </h4>
                <div className="max-h-[70vh] overflow-y-auto pr-1 -mr-1">
                <Form onSubmit={handleFormSubmit}>
                    <FormItem label="No Peminjaman" asterisk>
                        <Input
                            placeholder="Contoh: PJ-005"
                            value={formData.noPeminjaman}
                            onChange={(e) => setFormData((prev) => ({ ...prev, noPeminjaman: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Nama Barang" asterisk>
                        <Input
                            placeholder="Contoh: Proyektor Epson"
                            value={formData.namaBarang}
                            onChange={(e) => setFormData((prev) => ({ ...prev, namaBarang: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Peminjam" asterisk>
                        <Input
                            placeholder="Contoh: Kelas XI IPA 1"
                            value={formData.peminjam}
                            onChange={(e) => setFormData((prev) => ({ ...prev, peminjam: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Tanggal Pinjam" asterisk>
                        <Input
                            type="date"
                            value={formData.tanggalPinjam}
                            onChange={(e) => setFormData((prev) => ({ ...prev, tanggalPinjam: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Tanggal Kembali" asterisk>
                        <Input
                            type="date"
                            value={formData.tanggalKembali}
                            onChange={(e) => setFormData((prev) => ({ ...prev, tanggalKembali: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Status">
                        <Select<StatusOption>
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={(option) => option && setSelectedStatus(option)}
                        />
                    </FormItem>

                    <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-white dark:bg-gray-800 pt-4 pb-1">
                        <Button type="button" onClick={closeFormDialog}>
                            Batal
                        </Button>
                        <Button type="submit" variant="solid">
                            {formMode === 'edit' ? 'Simpan Perubahan' : 'Simpan'}
                        </Button>
                    </div>
                </Form>
                </div>
            </Dialog>

            {/* --- Dialog Konfirmasi Hapus --- */}
            <Dialog isOpen={!!deleteTarget} onClose={cancelDelete} onRequestClose={cancelDelete}>
                <h4 className="mb-2">Hapus Data Peminjaman?</h4>
                <p className="text-gray-500">
                    Data peminjaman <span className="font-semibold text-gray-700">{deleteTarget?.noPeminjaman}</span>{' '}
                    ({deleteTarget?.namaBarang}) akan dihapus secara permanen. Tindakan ini tidak bisa dibatalkan.
                </p>
                <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={cancelDelete}>Batal</Button>
                    <Button variant="solid" className="!bg-red-600 hover:!bg-red-700" onClick={handleDelete}>
                        Ya, Hapus
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}
