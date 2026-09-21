'use client'

import React, { useState } from 'react'
import type { FormEvent } from 'react'
import { CSVLink } from 'react-csv'
import {
    PiBookOpenDuotone,
    PiCheckCircleDuotone,
    PiXCircleDuotone,
    PiDownloadSimpleDuotone,
    PiPlusBold,
} from 'react-icons/pi'
import { Dialog, Button, Input, Select, Form, FormItem } from '@/components/ui'

// --- 1. Cetakan Data (Interface) untuk Master Data Mata Pelajaran ---
// Catatan: Pelajaran bersifat data master (bukan barang yang dipinjam),
// jadi status di sini "Aktif / Tidak Aktif", bukan "Tersedia / Dipinjam".
interface PelajaranItem {
    id: string
    kodeMapel: string
    namaMapel: string
    guruPengampu: string
    status: 'Aktif' | 'Tidak Aktif'
}

type StatusOption = { value: PelajaranItem['status']; label: string }

const csvHeaders = [
    { label: 'Kode Mapel', key: 'kodeMapel' },
    { label: 'Nama Mata Pelajaran', key: 'namaMapel' },
    { label: 'Guru Pengampu', key: 'guruPengampu' },
    { label: 'Status', key: 'status' },
]

const statusOptions: StatusOption[] = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Tidak Aktif', label: 'Tidak Aktif' },
]

const emptyForm = { kodeMapel: '', namaMapel: '', guruPengampu: '' }

// --- 2. Fungsi untuk Mewarnai Status (Badge) ---
const statusBadgeClass = (status: PelajaranItem['status']) => {
    if (status === 'Aktif') return 'bg-emerald-100 text-emerald-800'
    return 'bg-gray-100 text-gray-700' // Tidak Aktif
}

export default function PelajaranPanel() {
    // --- 3. Data Dummy (Mata Pelajaran) ---
    const [pelajaranData, setPelajaranData] = useState<PelajaranItem[]>([
        { id: '1', kodeMapel: 'MPL-001', namaMapel: 'Matematika', guruPengampu: 'Budi Santoso', status: 'Aktif' },
        { id: '2', kodeMapel: 'MPL-002', namaMapel: 'Fisika', guruPengampu: 'Siti Aminah', status: 'Aktif' },
        { id: '3', kodeMapel: 'MPL-003', namaMapel: 'Kimia', guruPengampu: 'Rudi Hartono', status: 'Aktif' },
        { id: '4', kodeMapel: 'MPL-004', namaMapel: 'Seni Rupa', guruPengampu: 'Dewi Lestari', status: 'Tidak Aktif' },
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

        const newItem: PelajaranItem = {
            id: `MPL-${Date.now()}`,
            kodeMapel: formData.kodeMapel,
            namaMapel: formData.namaMapel,
            guruPengampu: formData.guruPengampu,
            status: selectedStatus.value,
        }

        setPelajaranData((prev) => [newItem, ...prev])
        closeAddDialog()
    }

    // Perhitungan otomatis dari data, sama pola-nya dengan Dashboard.tsx
    const totalMapel = pelajaranData.length
    const mapelAktif = pelajaranData.filter((item) => item.status === 'Aktif').length
    const mapelTidakAktif = pelajaranData.filter((item) => item.status === 'Tidak Aktif').length

    return (
        <div className="p-6">
            {/* --- Bagian Header & Tombol --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Panel Data Mata Pelajaran</h2>
                    <p className="text-gray-500 mt-1">
                        Kelola daftar mata pelajaran beserta guru pengampunya.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="solid" icon={<PiPlusBold />} onClick={openAddDialog}>
                        Tambah Data
                    </Button>

                    <CSVLink
                        data={pelajaranData}
                        headers={csvHeaders}
                        filename={`pelajaran-${new Date().toISOString().slice(0, 10)}.csv`}
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
                        <PiBookOpenDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Mata Pelajaran</p>
                        <h3 className="text-3xl font-bold text-gray-800">{totalMapel}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full">
                        <PiCheckCircleDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Aktif</p>
                        <h3 className="text-3xl font-bold text-gray-800">{mapelAktif}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-gray-100 text-gray-500 rounded-full">
                        <PiXCircleDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Tidak Aktif</p>
                        <h3 className="text-3xl font-bold text-gray-800">{mapelTidakAktif}</h3>
                    </div>
                </div>
            </div>

            {/* --- Tabel Rincian Mata Pelajaran --- */}
            <div className="mt-2">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Rincian Mata Pelajaran</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-900">Kode Mapel</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Nama Mata Pelajaran</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Guru Pengampu</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {pelajaranData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{item.kodeMapel}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.namaMapel}</td>
                                    <td className="px-6 py-4 text-gray-700">{item.guruPengampu}</td>
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

            {/* --- Dialog Form "Tambah Data Mata Pelajaran" --- */}
            <Dialog isOpen={isAddDialogOpen} onClose={closeAddDialog} onRequestClose={closeAddDialog}>
                <h4 className="mb-4">Tambah Data Mata Pelajaran</h4>
                <Form onSubmit={handleAddSubmit}>
                    <FormItem label="Kode Mapel" asterisk>
                        <Input
                            placeholder="Contoh: MPL-005"
                            value={formData.kodeMapel}
                            onChange={(e) => setFormData((prev) => ({ ...prev, kodeMapel: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Nama Mata Pelajaran" asterisk>
                        <Input
                            placeholder="Contoh: Biologi"
                            value={formData.namaMapel}
                            onChange={(e) => setFormData((prev) => ({ ...prev, namaMapel: e.target.value }))}
                            required
                        />
                    </FormItem>

                    <FormItem label="Guru Pengampu" asterisk>
                        <Input
                            placeholder="Contoh: Andi Wijaya"
                            value={formData.guruPengampu}
                            onChange={(e) => setFormData((prev) => ({ ...prev, guruPengampu: e.target.value }))}
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

                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" onClick={closeAddDialog}>
                            Batal
                        </Button>
                        <Button type="submit" variant="solid">
                            Simpan
                        </Button>
                    </div>
                </Form>
            </Dialog>
        </div>
    )
}
