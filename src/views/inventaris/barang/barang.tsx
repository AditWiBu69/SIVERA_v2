'use client'

import React, { useState } from 'react'
import type { FormEvent } from 'react'
import { CSVLink } from 'react-csv'
import {
    PiArchiveDuotone,
    PiCheckCircleDuotone,
    PiHandshakeDuotone,
    PiDownloadSimpleDuotone,
    PiPlusBold,
} from 'react-icons/pi'
import { Dialog, Button, Input, Select, Form, FormItem } from '@/components/ui'

// --- 1. Cetakan Data (Interface) untuk Barang/Perlengkapan Sekolah ---
interface BarangItem {
    id: string
    kodeBarang: string
    namaBarang: string
    kategori: string
    jumlah: number
    status: 'Tersedia' | 'Dipinjam' | 'Rusak'
}

type StatusOption = { value: BarangItem['status']; label: string }

const csvHeaders = [
    { label: 'Kode Barang', key: 'kodeBarang' },
    { label: 'Nama Barang', key: 'namaBarang' },
    { label: 'Kategori', key: 'kategori' },
    { label: 'Jumlah', key: 'jumlah' },
    { label: 'Status', key: 'status' },
]

const statusOptions: StatusOption[] = [
    { value: 'Tersedia', label: 'Tersedia' },
    { value: 'Dipinjam', label: 'Dipinjam' },
    { value: 'Rusak', label: 'Rusak' },
]

const emptyForm = { kodeBarang: '', namaBarang: '', kategori: '', jumlah: '1' }

// --- 2. Fungsi untuk Mewarnai Status (Badge) ---
const statusBadgeClass = (status: BarangItem['status']) => {
    if (status === 'Tersedia') return 'bg-emerald-100 text-emerald-800'
    if (status === 'Dipinjam') return 'bg-purple-100 text-purple-800'
    return 'bg-rose-100 text-rose-800' // Rusak
}

export default function BarangPanel() {
    // --- 3. Data Dummy (Barang/Perlengkapan Sekolah) ---
    const [barangData, setBarangData] = useState<BarangItem[]>([
        { id: '1', kodeBarang: 'BRG-001', namaBarang: 'Proyektor Epson', kategori: 'Elektronik', jumlah: 5, status: 'Tersedia' },
        { id: '2', kodeBarang: 'BRG-002', namaBarang: 'Meja Lipat', kategori: 'Furnitur', jumlah: 20, status: 'Tersedia' },
        { id: '3', kodeBarang: 'BRG-003', namaBarang: 'Mikroskop', kategori: 'Alat Lab', jumlah: 3, status: 'Dipinjam' },
        { id: '4', kodeBarang: 'BRG-004', namaBarang: 'Bola Basket', kategori: 'Olahraga', jumlah: 8, status: 'Rusak' },
    ])

    // --- 4. State untuk dialog & form "Tambah Data" ---
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [formData, setFormData] = useState(emptyForm)
    const [selectedStatus, setSelectedStatus] = useState<StatusOption>(statusOptions[0])

    const openAddDialog = () => {
        setFormData(emptyForm)
        setSelectedStatus(statusOptions[0])
        setIsAddDialogOpen(true)
    }

    const closeAddDialog = () => setIsAddDialogOpen(false)

    const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newItem: BarangItem = {
            id: `BRG-${Date.now()}`,
            kodeBarang: formData.kodeBarang,
            namaBarang: formData.namaBarang,
            kategori: formData.kategori,
            jumlah: Math.max(0, Number(formData.jumlah) || 0),
            status: selectedStatus.value,
        }

        setBarangData((prev) => [newItem, ...prev])
        closeAddDialog()
    }

    // Perhitungan otomatis dari data (berdasarkan jumlah, sama pola-nya dengan Dashboard.tsx)
    const totalBarang = barangData.reduce((total, item) => total + item.jumlah, 0)
    const barangTersedia = barangData
        .filter((item) => item.status === 'Tersedia')
        .reduce((total, item) => total + item.jumlah, 0)
    const barangDipinjam = barangData
        .filter((item) => item.status === 'Dipinjam')
        .reduce((total, item) => total + item.jumlah, 0)

    return (
        <div className="p-6">
            {/* --- Bagian Header & Tombol --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Panel Inventaris Barang</h2>
                    <p className="text-gray-500 mt-1">
                        Pantau ketersediaan dan status perlengkapan/barang sekolah.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="solid" icon={<PiPlusBold />} onClick={openAddDialog}>
                        Tambah Data
                    </Button>

                    <CSVLink
                        data={barangData}
                        headers={csvHeaders}
                        filename={`barang-${new Date().toISOString().slice(0, 10)}.csv`}
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
                        <PiArchiveDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Barang</p>
                        <h3 className="text-3xl font-bold text-gray-800">{totalBarang}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full">
                        <PiCheckCircleDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Tersedia</p>
                        <h3 className="text-3xl font-bold text-gray-800">{barangTersedia}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-full">
                        <PiHandshakeDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Sedang Dipinjam</p>
                        <h3 className="text-3xl font-bold text-gray-800">{barangDipinjam}</h3>
                    </div>
                </div>
            </div>

            {/* --- Tabel Rincian Barang --- */}
            <div className="mt-2">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Rincian Barang</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-900">Kode Barang</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Nama Barang</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Kategori</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Jumlah</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {barangData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{item.kodeBarang}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.namaBarang}</td>
                                    <td className="px-6 py-4 text-gray-700">{item.kategori}</td>
                                    <td className="px-6 py-4 text-gray-700">{item.jumlah} Unit</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(item.status)}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Dialog Form "Tambah Data Barang" --- */}
            <Dialog isOpen={isAddDialogOpen} onClose={closeAddDialog} onRequestClose={closeAddDialog} width={640}>
                <h4 className="mb-4">Tambah Data Barang</h4>
                <div className="max-h-[70vh] overflow-y-auto pr-1 -mr-1">
                <Form onSubmit={handleAddSubmit}>
                    <FormItem label="Kode Barang" asterisk>
                        <Input
                            placeholder="Contoh: BRG-005"
                            value={formData.kodeBarang}
                            onChange={(e) => setFormData((prev) => ({ ...prev, kodeBarang: e.target.value }))}
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

                    <FormItem label="Kategori" asterisk>
                        <Input
                            placeholder="Contoh: Perlengkapan Kelas"
                            value={formData.kategori}
                            onChange={(e) => setFormData((prev) => ({ ...prev, kategori: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Jumlah" asterisk>
                        <Input
                            type="number"
                            min={0}
                            placeholder="Contoh: 10"
                            value={formData.jumlah}
                            onChange={(e) => setFormData((prev) => ({ ...prev, jumlah: e.target.value }))}
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
                        <Button type="button" onClick={closeAddDialog}>
                            Batal
                        </Button>
                        <Button type="submit" variant="solid">
                            Simpan
                        </Button>
                    </div>
                </Form>
                </div>
            </Dialog>
        </div>
    )
}
