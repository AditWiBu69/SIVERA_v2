import type { ReactNode } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Table from '@/components/ui/Table'

const { Tr, Td } = Table

/* ---------- Tipe data (skema inv_lab_sivera) ---------- */
export type Kategori = { replid: number; nama_kategori: string }
export type Lokasi = { replid: number; nama_ruangan: string }
export type Barang = {
    replid: number; lokasi_id: number; kategori_id: number; kode_barang: string; nama_barang: string
    jumlah_barang: number; jumlah_tersedia: number; kondisi: string; satuan: string
}
export type BarangMasuk = { replid: number; barang_id: number; jumlah: number; tgl_masuk: string; sumber: string }
export type BarangKeluar = { replid: number; barang_id: number; jumlah: number; tgl_keluar: string; alasan_keluar: string }
export type Pelajaran = {
    replid: number; lokasi_id: number; nama_pelajaran: string; hari: string
    waktu_mulai: string; waktu_berakhir: string; kelas: string
}
export type Peminjaman = { replid: number; lokasi_id: number; kode_peminjaman: string; tgl_peminjaman: string; status: string }
export type DetailPeminjaman = { replid: number; peminjaman_id: number; barang_id: number; jumlah: number }

/* ---------- Data contoh. Ganti dengan data dari database/API Anda. ---------- */
export const dataKategori: Kategori[] = [
    { replid: 1, nama_kategori: 'Elektronik' },
    { replid: 2, nama_kategori: 'Alat Praktikum' },
    { replid: 3, nama_kategori: 'Perabot' },
]
export const dataLokasi: Lokasi[] = [
    { replid: 1, nama_ruangan: 'Lab Komputer' },
    { replid: 2, nama_ruangan: 'Lab IPA' },
    { replid: 3, nama_ruangan: 'Gudang Sarpras' },
]
export const dataBarang: Barang[] = [
    { replid: 1, lokasi_id: 1, kategori_id: 1, kode_barang: 'BRG-001', nama_barang: 'Laptop', jumlah_barang: 30, jumlah_tersedia: 28, kondisi: 'Baik', satuan: 'unit' },
    { replid: 2, lokasi_id: 1, kategori_id: 1, kode_barang: 'BRG-002', nama_barang: 'Kabel LAN 5 m', jumlah_barang: 50, jumlah_tersedia: 44, kondisi: 'Baik', satuan: 'pcs' },
    { replid: 3, lokasi_id: 2, kategori_id: 2, kode_barang: 'BRG-003', nama_barang: 'Mikroskop Binokuler', jumlah_barang: 12, jumlah_tersedia: 12, kondisi: 'Baik', satuan: 'unit' },
    { replid: 4, lokasi_id: 2, kategori_id: 2, kode_barang: 'BRG-004', nama_barang: 'Gelas Ukur 100 ml', jumlah_barang: 40, jumlah_tersedia: 36, kondisi: 'Rusak Ringan', satuan: 'pcs' },
    { replid: 5, lokasi_id: 3, kategori_id: 3, kode_barang: 'BRG-005', nama_barang: 'Kursi Lab', jumlah_barang: 60, jumlah_tersedia: 60, kondisi: 'Baik', satuan: 'unit' },
]
export const dataMasuk: BarangMasuk[] = [
    { replid: 1, barang_id: 1, jumlah: 10, tgl_masuk: '2026-08-04T09:00', sumber: 'Dana BOS' },
    { replid: 2, barang_id: 3, jumlah: 4, tgl_masuk: '2026-09-12T10:30', sumber: 'Hibah komite' },
]
export const dataKeluar: BarangKeluar[] = [
    { replid: 1, barang_id: 4, jumlah: 4, tgl_keluar: '2026-09-20T13:15', alasan_keluar: 'Pecah' },
    { replid: 2, barang_id: 2, jumlah: 6, tgl_keluar: '2026-09-28T08:00', alasan_keluar: 'Dipindahkan' },
]
export const dataPelajaran: Pelajaran[] = [
    { replid: 1, lokasi_id: 1, nama_pelajaran: 'Informatika', hari: 'Senin', waktu_mulai: '08:00', waktu_berakhir: '09:30', kelas: 'X-1' },
    { replid: 2, lokasi_id: 2, nama_pelajaran: 'Biologi', hari: 'Selasa', waktu_mulai: '10:00', waktu_berakhir: '11:30', kelas: 'XI IPA 1' },
    { replid: 3, lokasi_id: 2, nama_pelajaran: 'Kimia', hari: 'Kamis', waktu_mulai: '08:00', waktu_berakhir: '09:30', kelas: 'XII IPA 2' },
]
export const dataPeminjaman: Peminjaman[] = [
    { replid: 1, lokasi_id: 1, kode_peminjaman: 'PMJ-001', tgl_peminjaman: '2026-09-28T08:10', status: 'Dikembalikan' },
    { replid: 2, lokasi_id: 2, kode_peminjaman: 'PMJ-002', tgl_peminjaman: '2026-09-29T10:15', status: 'Dikembalikan' },
    { replid: 3, lokasi_id: 2, kode_peminjaman: 'PMJ-003', tgl_peminjaman: '2026-10-01T08:20', status: 'Dipinjam' },
    { replid: 4, lokasi_id: 1, kode_peminjaman: 'PMJ-004', tgl_peminjaman: '2026-09-30T09:00', status: 'Dikembalikan' },
]
export const dataDetail: DetailPeminjaman[] = [
    { replid: 1, peminjaman_id: 1, barang_id: 1, jumlah: 10 },
    { replid: 2, peminjaman_id: 1, barang_id: 2, jumlah: 10 },
    { replid: 3, peminjaman_id: 2, barang_id: 3, jumlah: 6 },
    { replid: 4, peminjaman_id: 3, barang_id: 4, jumlah: 8 },
    { replid: 5, peminjaman_id: 3, barang_id: 3, jumlah: 2 },
]

/* ---------- Helper & komponen bersama ---------- */
export const inRange = (value: string, from: string, to: string) => {
    const d = value.slice(0, 10)
    return (!from || d >= from) && (!to || d <= to)
}

export const kondisiClass: Record<string, string> = {
    Baik: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100',
    'Rusak Ringan': 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-100',
    'Rusak Berat': 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100',
}

export const ReportCard = ({ title, filters, children }: { title: string; filters?: ReactNode; children: ReactNode }) => (
    <Card>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h3>{title}</h3>
            <div className="flex flex-wrap items-end gap-2">{filters}</div>
        </div>
        {children}
    </Card>
)

export const DateRange = ({ from, to, onFrom, onTo }: { from: string; to: string; onFrom: (v: string) => void; onTo: (v: string) => void }) => (
    <>
        <div>
            <label className="form-label mb-1 block">Dari tanggal</label>
            <Input type="date" value={from} onChange={(e) => onFrom(e.target.value)} />
        </div>
        <div>
            <label className="form-label mb-1 block">Sampai tanggal</label>
            <Input type="date" value={to} onChange={(e) => onTo(e.target.value)} />
        </div>
    </>
)

export const EmptyRow = ({ cols }: { cols: number }) => (
    <Tr>
        <Td colSpan={cols} className="py-8 text-center">
            Tidak ada data pada filter ini.
        </Td>
    </Tr>
)
