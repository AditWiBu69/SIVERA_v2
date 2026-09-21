'use client'

import React, { useState } from 'react'
import type { FormEvent } from 'react'
import { CSVLink } from 'react-csv'
import {
    PiFlaskDuotone,
    PiCheckCircleDuotone,
    PiHandshakeDuotone,
    PiDownloadSimpleDuotone,
    PiPlusBold,
} from 'react-icons/pi'
import { Dialog, Button, Input, Select, Form, FormItem } from '@/components/ui'

// --- 1. Cetakan Data (Interface) dengan penyesuaian untuk Lab Sekolah ---
interface InventoryItem {
    id: string
    kodeLab: string
    namaLab: string
    kelas: string
    status: 'Tersedia' | 'Dipinjam' | 'Keluar'
}

type StatusOption = { value: InventoryItem['status']; label: string }

const csvHeaders = [
    { label: 'Kode Lab', key: 'kodeLab' },
    { label: 'Nama Laboratorium', key: 'namaLab' },
    { label: 'Pengguna / Kelas', key: 'kelas' },
    { label: 'Status', key: 'status' },
]

const statusOptions: StatusOption[] = [
    { value: 'Tersedia', label: 'Tersedia' },
    { value: 'Dipinjam', label: 'Dipinjam' },
    { value: 'Keluar', label: 'Keluar' },
]

const emptyForm = { kodeLab: '', namaLab: '', kelas: '' }

// --- 2. Fungsi untuk Mewarnai Status (Badge), pakai kelas Tailwind ---
const statusBadgeClass = (status: InventoryItem['status']) => {
    if (status === 'Tersedia') return 'bg-emerald-100 text-emerald-800'
    if (status === 'Dipinjam') return 'bg-purple-100 text-purple-800'
    return 'bg-orange-100 text-orange-800' // Keluar
}

export default function InventoryPanel() {
    // --- 3. Data Dummy (Ruangan Lab Sekolah dan Kelas) ---
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([
        { id: '1', kodeLab: 'LAB-KOM-01', namaLab: 'Laboratorium Komputer Utama', kelas: 'Kelas XII RPL', status: 'Tersedia' },
        { id: '2', kodeLab: 'LAB-FIS-02', namaLab: 'Laboratorium Fisika Dasar', kelas: 'Kelas XI MIPA', status: 'Dipinjam' },
        { id: '3', kodeLab: 'LAB-KIM-03', namaLab: 'Laboratorium Kimia Analitik', kelas: 'Kelas XII MIPA', status: 'Keluar' },
        { id: '4', kodeLab: 'LAB-BIO-04', namaLab: 'Laboratorium Biologi Terpadu', kelas: 'Kelas X Fase E', status: 'Tersedia' },
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

        const newItem: InventoryItem = {
            id: `LAB-${Date.now()}`,
            kodeLab: formData.kodeLab,
            namaLab: formData.namaLab,
            kelas: formData.kelas,
            status: selectedStatus.value,
        }

        // Data baru ditaruh di paling atas supaya langsung terlihat tanpa scroll
        setInventoryData((prev) => [newItem, ...prev])
        closeAddDialog()
    }

    // Perhitungan otomatis dari data, sama pola-nya dengan Dashboard.tsx
    const totalRuanganLab = inventoryData.length
    const ruanganTersedia = inventoryData.filter((item) => item.status === 'Tersedia').length
    const ruanganDipinjam = inventoryData.filter((item) => item.status === 'Dipinjam').length

    return (
        <div className="p-6">
            {/* --- Bagian Header & Tombol (pola sama dengan Dashboard) --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Panel Inventaris Ruangan Lab</h2>
                    <p className="text-gray-500 mt-1">
                        Pantau ketersediaan dan status penggunaan laboratorium sekolah.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="solid"
                        icon={<PiPlusBold />}
                        onClick={openAddDialog}
                    >
                        Tambah Data
                    </Button>

                    <CSVLink
                        data={inventoryData}
                        headers={csvHeaders}
                        filename={`ruangan-lab-${new Date().toISOString().slice(0, 10)}.csv`}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
                    >
                        <PiDownloadSimpleDuotone className="text-xl" />
                        <span>Export Data</span>
                    </CSVLink>
                </div>
            </div>

            {/* --- Kartu Ringkasan (Metrik), persis pola Dashboard --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                        <PiFlaskDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Ruangan Lab</p>
                        <h3 className="text-3xl font-bold text-gray-800">{totalRuanganLab}</h3>
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

            {/* --- Tabel Rincian Data Lab, persis pola Dashboard --- */}
            <div className="mt-2">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Rincian Ruangan Lab dan Kelas</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-900">Kode Lab</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Nama Laboratorium</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Pengguna / Kelas</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {inventoryData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{item.kodeLab}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.namaLab}</td>
                                    <td className="px-6 py-4 text-gray-700">{item.kelas}</td>
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

            {/* --- Dialog Form "Tambah Data Ruangan Lab" --- */}
            <Dialog
                isOpen={isAddDialogOpen}
                onClose={closeAddDialog}
                onRequestClose={closeAddDialog}
            >
                <h4 className="mb-4">Tambah Data Ruangan Lab</h4>
                <Form onSubmit={handleAddSubmit}>
                    <FormItem label="Kode Lab" asterisk>
                        <Input
                            placeholder="Contoh: LAB-KOM-02"
                            value={formData.kodeLab}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, kodeLab: e.target.value }))
                            }
                            required
                        />
                    </FormItem>

                    <FormItem label="Nama Laboratorium" asterisk>
                        <Input
                            placeholder="Contoh: Laboratorium Komputer 2"
                            value={formData.namaLab}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, namaLab: e.target.value }))
                            }
                            required
                        />
                    </FormItem>

                    <FormItem label="Pengguna / Kelas" asterisk>
                        <Input
                            placeholder="Contoh: Kelas X RPL"
                            value={formData.kelas}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, kelas: e.target.value }))
                            }
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
