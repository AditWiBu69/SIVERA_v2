'use client'

import React, { useState } from 'react'
import type { FormEvent } from 'react'
import { CSVLink } from 'react-csv'
import {
    PiDoorOpenDuotone,
    PiCheckCircleDuotone,
    PiHandshakeDuotone,
    PiDownloadSimpleDuotone,
    PiPlusBold,
} from 'react-icons/pi'
import { Dialog, Button, Input, Select, Form, FormItem } from '@/components/ui'

// --- 1. Cetakan Data (Interface) untuk Ruangan Umum (kelas, ruang guru, ruang rapat, dll) ---
interface RuanganItem {
    id: string
    kodeRuangan: string
    namaRuangan: string
    lokasi: string
    status: 'Tersedia' | 'Dipinjam' | 'Perbaikan'
}

type StatusOption = { value: RuanganItem['status']; label: string }

const csvHeaders = [
    { label: 'Kode Ruangan', key: 'kodeRuangan' },
    { label: 'Nama Ruangan', key: 'namaRuangan' },
    { label: 'Lokasi', key: 'lokasi' },
    { label: 'Status', key: 'status' },
]

const statusOptions: StatusOption[] = [
    { value: 'Tersedia', label: 'Tersedia' },
    { value: 'Dipinjam', label: 'Dipinjam' },
    { value: 'Perbaikan', label: 'Perbaikan' },
]

const emptyForm = { kodeRuangan: '', namaRuangan: '', lokasi: '' }

// --- 2. Fungsi untuk Mewarnai Status (Badge) ---
const statusBadgeClass = (status: RuanganItem['status']) => {
    if (status === 'Tersedia') return 'bg-emerald-100 text-emerald-800'
    if (status === 'Dipinjam') return 'bg-purple-100 text-purple-800'
    return 'bg-orange-100 text-orange-800' // Perbaikan
}

export default function RuanganPanel() {
    // --- 3. Data Dummy (Ruangan Umum Sekolah) ---
    const [ruanganData, setRuanganData] = useState<RuanganItem[]>([
        { id: '1', kodeRuangan: 'RG-KLS-01', namaRuangan: 'Ruang Kelas X-1', lokasi: 'Gedung A, Lantai 1', status: 'Tersedia' },
        { id: '2', kodeRuangan: 'RG-KLS-02', namaRuangan: 'Ruang Kelas XI-2', lokasi: 'Gedung A, Lantai 2', status: 'Dipinjam' },
        { id: '3', kodeRuangan: 'RG-GRU-01', namaRuangan: 'Ruang Guru', lokasi: 'Gedung B, Lantai 1', status: 'Tersedia' },
        { id: '4', kodeRuangan: 'RG-RPT-01', namaRuangan: 'Ruang Rapat', lokasi: 'Gedung B, Lantai 2', status: 'Perbaikan' },
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

        const newItem: RuanganItem = {
            id: `RG-${Date.now()}`,
            kodeRuangan: formData.kodeRuangan,
            namaRuangan: formData.namaRuangan,
            lokasi: formData.lokasi,
            status: selectedStatus.value,
        }

        setRuanganData((prev) => [newItem, ...prev])
        closeAddDialog()
    }

    // Perhitungan otomatis dari data, sama pola-nya dengan Dashboard.tsx
    const totalRuangan = ruanganData.length
    const ruanganTersedia = ruanganData.filter((item) => item.status === 'Tersedia').length
    const ruanganDipinjam = ruanganData.filter((item) => item.status === 'Dipinjam').length

    return (
        <div className="p-6">
            {/* --- Bagian Header & Tombol --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Panel Inventaris Ruangan</h2>
                    <p className="text-gray-500 mt-1">
                        Pantau ketersediaan dan status penggunaan ruangan sekolah (kelas, ruang guru, ruang rapat).
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="solid" icon={<PiPlusBold />} onClick={openAddDialog}>
                        Tambah Data
                    </Button>

                    <CSVLink
                        data={ruanganData}
                        headers={csvHeaders}
                        filename={`ruangan-${new Date().toISOString().slice(0, 10)}.csv`}
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
                        <PiDoorOpenDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Ruangan</p>
                        <h3 className="text-3xl font-bold text-gray-800">{totalRuangan}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full">
                        <PiCheckCircleDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Tersedia</p>
                        <h3 className="text-3xl font-bold text-gray-800">{ruanganTersedia}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-full">
                        <PiHandshakeDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Sedang Dipinjam</p>
                        <h3 className="text-3xl font-bold text-gray-800">{ruanganDipinjam}</h3>
                    </div>
                </div>
            </div>

            {/* --- Tabel Rincian Ruangan --- */}
            <div className="mt-2">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Rincian Ruangan</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-900">Kode Ruangan</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Nama Ruangan</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Lokasi</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {ruanganData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{item.kodeRuangan}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.namaRuangan}</td>
                                    <td className="px-6 py-4 text-gray-700">{item.lokasi}</td>
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

            {/* --- Dialog Form "Tambah Data Ruangan" --- */}
            <Dialog isOpen={isAddDialogOpen} onClose={closeAddDialog} onRequestClose={closeAddDialog} width={640}>
                <h4 className="mb-4">Tambah Data Ruangan</h4>
                <div className="max-h-[70vh] overflow-y-auto pr-1 -mr-1">
                <Form onSubmit={handleAddSubmit}>
                    <FormItem label="Kode Ruangan" asterisk>
                        <Input
                            placeholder="Contoh: RG-KLS-03"
                            value={formData.kodeRuangan}
                            onChange={(e) => setFormData((prev) => ({ ...prev, kodeRuangan: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Nama Ruangan" asterisk>
                        <Input
                            placeholder="Contoh: Ruang Kelas X-3"
                            value={formData.namaRuangan}
                            onChange={(e) => setFormData((prev) => ({ ...prev, namaRuangan: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Lokasi" asterisk>
                        <Input
                            placeholder="Contoh: Gedung A, Lantai 1"
                            value={formData.lokasi}
                            onChange={(e) => setFormData((prev) => ({ ...prev, lokasi: e.target.value }))}
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
