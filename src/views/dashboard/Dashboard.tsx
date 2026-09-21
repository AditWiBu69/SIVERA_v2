'use client'

import React from 'react'
import { CSVLink } from 'react-csv'
import {
    PiArchiveDuotone,
    PiSignOutDuotone,
    PiHandshakeDuotone,
    PiDownloadSimpleDuotone,
} from 'react-icons/pi'

// Data tiruan (Bisa diganti dengan data dari API/database nanti)
const dataInventory = [
    { id: 'INV-001', namaBarang: 'Laptop Asus ROG', status: 'Tersedia', jumlah: 10 },
    { id: 'INV-002', namaBarang: 'Proyektor Epson', status: 'Dipinjam', jumlah: 3 },
    { id: 'INV-003', namaBarang: 'Kertas HVS A4', status: 'Keluar', jumlah: 50 },
    { id: 'INV-004', namaBarang: 'Spidol Papan Tulis', status: 'Keluar', jumlah: 25 },
    { id: 'INV-005', namaBarang: 'Kamera DSLR Canon', status: 'Dipinjam', jumlah: 2 },
    { id: 'INV-006', namaBarang: 'Meja Kerja', status: 'Tersedia', jumlah: 15 },
]

const csvHeaders = [
    { label: 'ID Barang', key: 'id' },
    { label: 'Nama Barang', key: 'namaBarang' },
    { label: 'Status', key: 'status' },
    { label: 'Jumlah', key: 'jumlah' },
]

const statusBadgeClass = (status: string) => {
    if (status === 'Tersedia') return 'bg-emerald-100 text-emerald-800'
    if (status === 'Keluar') return 'bg-orange-100 text-orange-800'
    return 'bg-purple-100 text-purple-800' // Dipinjam
}

const Dashboard = () => {
    // Perhitungan otomatis dari data (bukan angka hardcode lagi)
    const totalBarang = dataInventory.reduce((total, item) => total + item.jumlah, 0)
    const barangKeluar = dataInventory
        .filter((item) => item.status === 'Keluar')
        .reduce((total, item) => total + item.jumlah, 0)
    const barangDipinjam = dataInventory
        .filter((item) => item.status === 'Dipinjam')
        .reduce((total, item) => total + item.jumlah, 0)

    return (
        <div className="p-6">
            {/* Header Dashboard */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Dashboard Inventaris</h2>
                    <p className="text-gray-500 mt-1">
                        Ringkasan aktivitas dan status inventaris saat ini secara real-time.
                    </p>
                </div>

                <CSVLink
                    data={dataInventory}
                    headers={csvHeaders}
                    filename={`ringkasan-inventaris-${new Date().toISOString().slice(0, 10)}.csv`}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
                >
                    <PiDownloadSimpleDuotone className="text-xl" />
                    <span>Export Ringkasan</span>
                </CSVLink>
            </div>

            {/* Kartu Ringkasan (Metrik) */}
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
                    <div className="p-4 bg-rose-50 text-rose-600 rounded-full">
                        <PiSignOutDuotone className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Barang Keluar</p>
                        <h3 className="text-3xl font-bold text-gray-800">{barangKeluar}</h3>
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

            {/* Tabel Rincian Data Barang */}
            <div className="mt-2">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Rincian Data Barang</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-900">ID Barang</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Nama Barang</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-900">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {dataInventory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                                    <td className="px-6 py-4 text-gray-700">{item.namaBarang}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(item.status)}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{item.jumlah} Unit</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
