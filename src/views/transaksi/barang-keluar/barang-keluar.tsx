'use client'

import React, { useState } from 'react'
import type { FormEvent } from 'react'
import { CSVLink } from 'react-csv'
import {
    PiTruckDuotone,
    PiCheckCircleDuotone,
    PiClockCountdownDuotone,
    PiDownloadSimpleDuotone,
    PiPlusBold,
    PiPencilSimpleLineDuotone,
    PiTrashDuotone,
} from 'react-icons/pi'
import { Dialog, Button, Input, Select, Form, FormItem, Notification, toast } from '@/components/ui'

// --- 1. Cetakan Data (Interface) untuk Transaksi Barang Keluar ---
interface BarangKeluarItem {
    id: string
    noTransaksi: string
    namaBarang: string
    jumlah: number
    tujuan: string
    tanggal: string
    status: 'Selesai' | 'Diproses' | 'Dibatalkan'
}

type StatusOption = { value: BarangKeluarItem['status']; label: string }

const csvHeaders = [
    { label: 'No Transaksi', key: 'noTransaksi' },
    { label: 'Nama Barang', key: 'namaBarang' },
    { label: 'Jumlah', key: 'jumlah' },
    { label: 'Tujuan', key: 'tujuan' },
    { label: 'Tanggal', key: 'tanggal' },
    { label: 'Status', key: 'status' },
]

const statusOptions: StatusOption[] = [
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Diproses', label: 'Diproses' },
    { value: 'Dibatalkan', label: 'Dibatalkan' },
]

const emptyForm = { noTransaksi: '', namaBarang: '', jumlah: '1', tujuan: '', tanggal: '' }

// --- 2. Fungsi untuk Mewarnai Status (Badge) ---
const statusBadgeClass = (status: BarangKeluarItem['status']) => {
    if (status === 'Selesai') return 'bg-emerald-100 text-emerald-800'
    if (status === 'Diproses') return 'bg-amber-100 text-amber-800'
    return 'bg-rose-100 text-rose-800' // Dibatalkan
}

export default function BarangKeluarPanel() {
    // --- 3. Data Dummy (Transaksi Barang Keluar) ---
    const [data, setData] = useState<BarangKeluarItem[]>([
        { id: '1', noTransaksi: 'BK-001', namaBarang: 'Spidol Papan Tulis', jumlah: 25, tujuan: 'Ruang Kelas X-1', tanggal: '2026-09-02', status: 'Selesai' },
        { id: '2', noTransaksi: 'BK-002', namaBarang: 'Kertas HVS A4', jumlah: 20, tujuan: 'Ruang Tata Usaha', tanggal: '2026-09-06', status: 'Selesai' },
        { id: '3', noTransaksi: 'BK-003', namaBarang: 'Proyektor Epson', jumlah: 1, tujuan: 'Lab Komputer', tanggal: '2026-09-11', status: 'Diproses' },
        { id: '4', noTransaksi: 'BK-004', namaBarang: 'Bola Basket', jumlah: 5, tujuan: 'Ekskul Basket', tanggal: '2026-09-13', status: 'Dibatalkan' },
    ])

    // --- 4. State untuk dialog Tambah/Edit (satu dialog, dibedakan lewat formMode) ---
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState(emptyForm)
    const [selectedStatus, setSelectedStatus] = useState<StatusOption>(statusOptions[0])

    // --- 5. State untuk dialog konfirmasi Hapus ---
    const [deleteTarget, setDeleteTarget] = useState<BarangKeluarItem | null>(null)

    const openAddDialog = () => {
        setFormMode('add')
        setEditingId(null)
        setFormData(emptyForm)
        setSelectedStatus(statusOptions[0])
        setIsFormDialogOpen(true)
    }

    const openEditDialog = (item: BarangKeluarItem) => {
        setFormMode('edit')
        setEditingId(item.id)
        setFormData({
            noTransaksi: item.noTransaksi,
            namaBarang: item.namaBarang,
            jumlah: String(item.jumlah),
            tujuan: item.tujuan,
            tanggal: item.tanggal,
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
                              noTransaksi: formData.noTransaksi,
                              namaBarang: formData.namaBarang,
                              jumlah: Math.max(0, Number(formData.jumlah) || 0),
                              tujuan: formData.tujuan,
                              tanggal: formData.tanggal,
                              status: selectedStatus.value,
                          }
                        : item,
                ),
            )
            toast.push(
                <Notification type="success" title="Data diperbarui">
                    Transaksi barang keluar berhasil diubah.
                </Notification>,
            )
        } else {
            const newItem: BarangKeluarItem = {
                id: `BK-${Date.now()}`,
                noTransaksi: formData.noTransaksi,
                namaBarang: formData.namaBarang,
                jumlah: Math.max(0, Number(formData.jumlah) || 0),
                tujuan: formData.tujuan,
                tanggal: formData.tanggal,
                status: selectedStatus.value,
            }
            setData((prev) => [newItem, ...prev])
            toast.push(
                <Notification type="success" title="Data ditambahkan">
                    Transaksi barang keluar baru berhasil disimpan.
                </Notification>,
            )
        }

        closeFormDialog()
    }

    const confirmDelete = (item: BarangKeluarItem) => setDeleteTarget(item)
    const cancelDelete = () => setDeleteTarget(null)

    const handleDelete = () => {
        if (!deleteTarget) return
        setData((prev) => prev.filter((item) => item.id !== deleteTarget.id))
        toast.push(
            <Notification type="success" title="Data dihapus">
                Transaksi &quot;{deleteTarget.noTransaksi}&quot; telah dihapus.
            </Notification>,
        )
        setDeleteTarget(null)
    }

    // Perhitungan otomatis dari data
    const totalTransaksi = data.length
    const jumlahSelesai = data.filter((item) => item.status === 'Selesai').length
    const jumlahDiproses = data.filter((item) => item.status === 'Diproses').length

    return (
        <div className="p-6">
            {/* --- Bagian Header & Tombol --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Transaksi Barang Keluar</h2>
                    <p className="text-gray-500 mt-1">
                        Catat dan pantau barang yang keluar dari inventaris sekolah.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="solid" icon={<PiPlusBold />} onClick={openAddDialog}>
                        Tambah Data
                    </Button>

                    <CSVLink
                        data={data}
                        headers={csvHeaders}
                        filename={`barang-keluar-${new Date().toISOString().slice(0, 10)}.csv`}
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
                        <PiTruckDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Transaksi</p>
                        <h3 className="text-3xl font-bold text-gray-800">{totalTransaksi}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full">
                        <PiCheckCircleDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Selesai</p>
                        <h3 className="text-3xl font-bold text-gray-800">{jumlahSelesai}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-full">
                        <PiClockCountdownDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Sedang Diproses</p>
                        <h3 className="text-3xl font-bold text-gray-800">{jumlahDiproses}</h3>
                    </div>
                </div>
            </div>

            {/* --- Tabel Rincian Transaksi --- */}
            <div className="mt-2">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Rincian Transaksi Barang Keluar</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-900">No Transaksi</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Nama Barang</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Jumlah</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Tujuan</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Tanggal</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-900 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{item.noTransaksi}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.namaBarang}</td>
                                    <td className="px-6 py-4 text-gray-700">{item.jumlah} Unit</td>
                                    <td className="px-6 py-4 text-gray-700">{item.tujuan}</td>
                                    <td className="px-6 py-4 text-gray-700">{item.tanggal}</td>
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
                    {formMode === 'edit' ? 'Ubah Data Barang Keluar' : 'Tambah Data Barang Keluar'}
                </h4>
                <div className="max-h-[70vh] overflow-y-auto pr-1 -mr-1">
                <Form onSubmit={handleFormSubmit}>
                    <FormItem label="No Transaksi" asterisk>
                        <Input
                            placeholder="Contoh: BK-005"
                            value={formData.noTransaksi}
                            onChange={(e) => setFormData((prev) => ({ ...prev, noTransaksi: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Nama Barang" asterisk>
                        <Input
                            placeholder="Contoh: Papan Tulis"
                            value={formData.namaBarang}
                            onChange={(e) => setFormData((prev) => ({ ...prev, namaBarang: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Jumlah" asterisk>
                        <Input
                            type="number"
                            min={0}
                            placeholder="Contoh: 5"
                            value={formData.jumlah}
                            onChange={(e) => setFormData((prev) => ({ ...prev, jumlah: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Tujuan" asterisk>
                        <Input
                            placeholder="Contoh: Ruang Kelas X-2"
                            value={formData.tujuan}
                            onChange={(e) => setFormData((prev) => ({ ...prev, tujuan: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Tanggal" asterisk>
                        <Input
                            type="date"
                            value={formData.tanggal}
                            onChange={(e) => setFormData((prev) => ({ ...prev, tanggal: e.target.value }))}
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
                <h4 className="mb-2">Hapus Transaksi?</h4>
                <p className="text-gray-500">
                    Data transaksi <span className="font-semibold text-gray-700">{deleteTarget?.noTransaksi}</span>{' '}
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
