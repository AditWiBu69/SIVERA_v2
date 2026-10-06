'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import Tabs from '@/components/ui/Tabs'
import Tag from '@/components/ui/Tag'
import Dialog from '@/components/ui/Dialog'
import Pagination from '@/components/ui/Pagination'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbPlus, TbSearch, TbTrash } from 'react-icons/tb'

const { Tr, Th, Td, THead, TBody } = Table
const { TabList, TabNav, TabContent } = Tabs

/* ------------------------------------------------------------------ */
/* Tipe data (sesuai skema database inv_lab_sivera)                    */
/* ------------------------------------------------------------------ */

type Kategori = { replid: number; nama_kategori: string }
type Lokasi = { replid: number; nama_ruangan: string }

type Barang = {
    replid: number
    lokasi_id: number
    kategori_id: number
    kode_barang: string
    nama_barang: string
    jumlah_barang: number
    jumlah_tersedia: number
    kondisi: string
    satuan: string
}

type BarangMasuk = {
    replid: number
    barang_id: number
    jumlah: number
    tgl_masuk: string
    sumber: string
    keterangan: string
}

type BarangKeluar = {
    replid: number
    barang_id: number
    jumlah: number
    tgl_keluar: string
    alasan_keluar: string
    keterangan: string
}

/* ------------------------------------------------------------------ */
/* Data contoh. Ganti dengan hasil fetch ke API/database Anda.         */
/* ------------------------------------------------------------------ */

const dataKategori: Kategori[] = [
    { replid: 1, nama_kategori: 'Elektronik' },
    { replid: 2, nama_kategori: 'Alat Praktikum' },
    { replid: 3, nama_kategori: 'Perabot' },
]

const dataLokasi: Lokasi[] = [
    { replid: 1, nama_ruangan: 'Lab Komputer' },
    { replid: 2, nama_ruangan: 'Lab IPA' },
    { replid: 3, nama_ruangan: 'Gudang Sarpras' },
]

const dataBarang: Barang[] = [
    { replid: 1, lokasi_id: 1, kategori_id: 1, kode_barang: 'BRG-001', nama_barang: 'Laptop', jumlah_barang: 30, jumlah_tersedia: 28, kondisi: 'Baik', satuan: 'unit' },
    { replid: 2, lokasi_id: 1, kategori_id: 1, kode_barang: 'BRG-002', nama_barang: 'Kabel LAN 5 m', jumlah_barang: 50, jumlah_tersedia: 44, kondisi: 'Baik', satuan: 'pcs' },
    { replid: 3, lokasi_id: 2, kategori_id: 2, kode_barang: 'BRG-003', nama_barang: 'Mikroskop Binokuler', jumlah_barang: 12, jumlah_tersedia: 12, kondisi: 'Baik', satuan: 'unit' },
    { replid: 4, lokasi_id: 2, kategori_id: 2, kode_barang: 'BRG-004', nama_barang: 'Gelas Ukur 100 ml', jumlah_barang: 40, jumlah_tersedia: 36, kondisi: 'Rusak Ringan', satuan: 'pcs' },
    { replid: 5, lokasi_id: 3, kategori_id: 3, kode_barang: 'BRG-005', nama_barang: 'Kursi Lab', jumlah_barang: 60, jumlah_tersedia: 60, kondisi: 'Baik', satuan: 'unit' },
]

const dataMasuk: BarangMasuk[] = [
    { replid: 1, barang_id: 1, jumlah: 10, tgl_masuk: '2026-08-04T09:00', sumber: 'Dana BOS', keterangan: 'Pengadaan semester ganjil' },
    { replid: 2, barang_id: 3, jumlah: 4, tgl_masuk: '2026-09-12T10:30', sumber: 'Hibah komite', keterangan: '' },
]

const dataKeluar: BarangKeluar[] = [
    { replid: 1, barang_id: 4, jumlah: 4, tgl_keluar: '2026-09-20T13:15', alasan_keluar: 'Pecah', keterangan: 'Pecah saat praktikum' },
    { replid: 2, barang_id: 2, jumlah: 6, tgl_keluar: '2026-09-28T08:00', alasan_keluar: 'Dipindahkan', keterangan: 'Dipakai di ruang server' },
]

/* ------------------------------------------------------------------ */
/* Helper                                                              */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 10

const kondisiOptions = ['Baik', 'Rusak Ringan', 'Rusak Berat'].map((k) => ({ value: k, label: k }))

const kondisiClass: Record<string, string> = {
    Baik: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100',
    'Rusak Ringan': 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-100',
    'Rusak Berat': 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100',
}

const fmtTanggal = (v: string) =>
    new Date(v).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })

const nextId = (rows: { replid: number }[]) => Math.max(0, ...rows.map((r) => r.replid)) + 1

const notify = (type: 'success' | 'danger' | 'warning', title: string) =>
    toast.push(<Notification type={type} title={title} />, { placement: 'top-center' })

const paginate = <T,>(rows: T[], page: number) => rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

type Option = { value: string; label: string }
type Field = {
    name: string
    label: string
    type?: 'text' | 'number' | 'datetime-local' | 'select'
    options?: Option[]
}

const FormDialog = ({
    title,
    fields,
    onClose,
    onSubmit,
}: {
    title: string
    fields: Field[]
    onClose: () => void
    onSubmit: (values: Record<string, string>) => void
}) => {
    const [values, setValues] = useState<Record<string, string>>({})
    const set = (name: string, value: string) => setValues((p) => ({ ...p, [name]: value }))

    return (
        <Dialog isOpen onClose={onClose} onRequestClose={onClose}>
            <h5 className="mb-4">{title}</h5>
            <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
                {fields.map((f) => (
                    <div key={f.name}>
                        <label className="form-label mb-2 block">{f.label}</label>
                        {f.type === 'select' ? (
                            <Select
                                placeholder="Pilih..."
                                options={f.options}
                                value={f.options?.find((o) => o.value === values[f.name]) ?? null}
                                onChange={(o) => set(f.name, o?.value ?? '')}
                            />
                        ) : (
                            <Input
                                type={f.type ?? 'text'}
                                value={values[f.name] ?? ''}
                                onChange={(e) => set(f.name, e.target.value)}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
                <Button onClick={onClose}>Batal</Button>
                <Button variant="solid" onClick={() => onSubmit(values)}>
                    Simpan
                </Button>
            </div>
        </Dialog>
    )
}

const EmptyRow = ({ cols }: { cols: number }) => (
    <Tr>
        <Td colSpan={cols} className="py-8 text-center">
            Tidak ada data yang cocok.
        </Td>
    </Tr>
)

const DeleteButton = ({ onClick }: { onClick: () => void }) => (
    <Button size="xs" variant="plain" icon={<TbTrash />} onClick={onClick}>
        Hapus
    </Button>
)

/* ------------------------------------------------------------------ */
/* Halaman utama                                                       */
/* ------------------------------------------------------------------ */

const StokBarang = () => {
    const [barang, setBarang] = useState(dataBarang)
    const [masuk, setMasuk] = useState(dataMasuk)
    const [keluar, setKeluar] = useState(dataKeluar)
    const [tab, setTab] = useState('barang')
    const [q, setQ] = useState('')
    const [page, setPage] = useState(1)
    const [dialogOpen, setDialogOpen] = useState(false)

    const namaKategori = (id: number) => dataKategori.find((k) => k.replid === id)?.nama_kategori ?? '-'
    const namaLokasi = (id: number) => dataLokasi.find((l) => l.replid === id)?.nama_ruangan ?? '-'
    const infoBarang = (id: number) => {
        const b = barang.find((x) => x.replid === id)
        return b ? `${b.kode_barang} - ${b.nama_barang}` : '-'
    }
    const satuan = (id: number) => barang.find((x) => x.replid === id)?.satuan ?? ''

    const ubahStok = (barangId: number, delta: number) =>
        setBarang((prev) =>
            prev.map((b) =>
                b.replid === barangId
                    ? { ...b, jumlah_barang: b.jumlah_barang + delta, jumlah_tersedia: b.jumlah_tersedia + delta }
                    : b,
            ),
        )

    /* ---------- filter pencarian ---------- */
    const s = q.trim().toLowerCase()
    const hit = (...v: (string | number)[]) => v.join(' ').toLowerCase().includes(s)

    const fBarang = barang.filter((b) =>
        hit(b.kode_barang, b.nama_barang, namaKategori(b.kategori_id), namaLokasi(b.lokasi_id), b.kondisi),
    )
    const fMasuk = masuk.filter((m) => hit(infoBarang(m.barang_id), m.sumber, m.keterangan))
    const fKeluar = keluar.filter((k) => hit(infoBarang(k.barang_id), k.alasan_keluar, k.keterangan))
    const total = { barang: fBarang.length, masuk: fMasuk.length, keluar: fKeluar.length }[tab] ?? 0

    /* ---------- aksi tambah ---------- */
    const tambahBarang = (v: Record<string, string>) => {
        const jumlah = Number(v.jumlah_barang)
        if (!v.kode_barang || !v.nama_barang || !v.kategori_id || !v.lokasi_id || !v.satuan || !v.kondisi || !v.jumlah_barang || !(jumlah >= 0))
            return notify('warning', 'Lengkapi semua kolom terlebih dulu')
        if (barang.some((b) => b.kode_barang === v.kode_barang))
            return notify('warning', 'Kode barang sudah digunakan')
        setBarang((p) => [
            ...p,
            {
                replid: nextId(p),
                lokasi_id: Number(v.lokasi_id),
                kategori_id: Number(v.kategori_id),
                kode_barang: v.kode_barang,
                nama_barang: v.nama_barang,
                jumlah_barang: jumlah,
                jumlah_tersedia: jumlah,
                kondisi: v.kondisi,
                satuan: v.satuan,
            },
        ])
        setDialogOpen(false)
        notify('success', 'Barang ditambahkan')
    }

    const tambahMasuk = (v: Record<string, string>) => {
        const jumlah = Number(v.jumlah)
        if (!v.barang_id || !v.tgl_masuk || !v.sumber || !(jumlah > 0))
            return notify('warning', 'Barang, jumlah, tanggal, dan sumber wajib diisi')
        setMasuk((p) => [
            ...p,
            { replid: nextId(p), barang_id: Number(v.barang_id), jumlah, tgl_masuk: v.tgl_masuk, sumber: v.sumber, keterangan: v.keterangan ?? '' },
        ])
        ubahStok(Number(v.barang_id), jumlah)
        setDialogOpen(false)
        notify('success', 'Barang masuk dicatat')
    }

    const tambahKeluar = (v: Record<string, string>) => {
        const jumlah = Number(v.jumlah)
        const b = barang.find((x) => x.replid === Number(v.barang_id))
        if (!b || !v.tgl_keluar || !v.alasan_keluar || !(jumlah > 0))
            return notify('warning', 'Barang, jumlah, tanggal, dan alasan wajib diisi')
        if (jumlah > b.jumlah_tersedia)
            return notify('warning', `Stok tersedia hanya ${b.jumlah_tersedia} ${b.satuan}`)
        setKeluar((p) => [
            ...p,
            { replid: nextId(p), barang_id: b.replid, jumlah, tgl_keluar: v.tgl_keluar, alasan_keluar: v.alasan_keluar, keterangan: v.keterangan ?? '' },
        ])
        ubahStok(b.replid, -jumlah)
        setDialogOpen(false)
        notify('success', 'Barang keluar dicatat')
    }

    /* ---------- aksi hapus ---------- */
    const hapusBarang = (b: Barang) => {
        if (masuk.some((m) => m.barang_id === b.replid) || keluar.some((k) => k.barang_id === b.replid))
            return notify('warning', 'Barang masih dipakai di data barang masuk/keluar')
        setBarang((p) => p.filter((x) => x.replid !== b.replid))
        notify('success', 'Barang dihapus')
    }

    const hapusMasuk = (m: BarangMasuk) => {
        const b = barang.find((x) => x.replid === m.barang_id)
        if (b && b.jumlah_tersedia < m.jumlah)
            return notify('warning', 'Stok tersedia kurang, barang sudah keluar atau dipinjam')
        setMasuk((p) => p.filter((x) => x.replid !== m.replid))
        ubahStok(m.barang_id, -m.jumlah)
        notify('success', 'Data barang masuk dihapus')
    }

    const hapusKeluar = (k: BarangKeluar) => {
        setKeluar((p) => p.filter((x) => x.replid !== k.replid))
        ubahStok(k.barang_id, k.jumlah)
        notify('success', 'Data barang keluar dihapus')
    }

    /* ---------- form dialog per tab ---------- */
    const barangOptions = barang.map((b) => ({ value: String(b.replid), label: `${b.kode_barang} - ${b.nama_barang}` }))

    const forms: Record<string, { title: string; button: string; fields: Field[]; submit: (v: Record<string, string>) => void }> = {
        barang: {
            title: 'Tambah barang',
            button: 'Tambah barang',
            submit: tambahBarang,
            fields: [
                { name: 'kode_barang', label: 'Kode barang' },
                { name: 'nama_barang', label: 'Nama barang' },
                { name: 'kategori_id', label: 'Kategori', type: 'select', options: dataKategori.map((k) => ({ value: String(k.replid), label: k.nama_kategori })) },
                { name: 'lokasi_id', label: 'Lokasi', type: 'select', options: dataLokasi.map((l) => ({ value: String(l.replid), label: l.nama_ruangan })) },
                { name: 'jumlah_barang', label: 'Jumlah barang', type: 'number' },
                { name: 'satuan', label: 'Satuan' },
                { name: 'kondisi', label: 'Kondisi', type: 'select', options: kondisiOptions },
            ],
        },
        masuk: {
            title: 'Catat barang masuk',
            button: 'Catat barang masuk',
            submit: tambahMasuk,
            fields: [
                { name: 'barang_id', label: 'Barang', type: 'select', options: barangOptions },
                { name: 'jumlah', label: 'Jumlah', type: 'number' },
                { name: 'tgl_masuk', label: 'Tanggal masuk', type: 'datetime-local' },
                { name: 'sumber', label: 'Sumber' },
                { name: 'keterangan', label: 'Keterangan' },
            ],
        },
        keluar: {
            title: 'Catat barang keluar',
            button: 'Catat barang keluar',
            submit: tambahKeluar,
            fields: [
                { name: 'barang_id', label: 'Barang', type: 'select', options: barangOptions },
                { name: 'jumlah', label: 'Jumlah', type: 'number' },
                { name: 'tgl_keluar', label: 'Tanggal keluar', type: 'datetime-local' },
                { name: 'alasan_keluar', label: 'Alasan keluar' },
                { name: 'keterangan', label: 'Keterangan' },
            ],
        },
    }
    const form = forms[tab]

    const changeTab = (value: string) => {
        setTab(value)
        setPage(1)
        setQ('')
    }

    return (
        <Card>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h3>Stok barang</h3>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                        className="sm:w-64"
                        placeholder="Cari data..."
                        prefix={<TbSearch className="text-lg" />}
                        value={q}
                        onChange={(e) => {
                            setQ(e.target.value)
                            setPage(1)
                        }}
                    />
                    <Button variant="solid" icon={<TbPlus />} onClick={() => setDialogOpen(true)}>
                        {form.button}
                    </Button>
                </div>
            </div>

            <Tabs value={tab} onChange={changeTab}>
                <TabList>
                    <TabNav value="barang">Barang ({barang.length})</TabNav>
                    <TabNav value="masuk">Barang masuk ({masuk.length})</TabNav>
                    <TabNav value="keluar">Barang keluar ({keluar.length})</TabNav>
                </TabList>

                <div className="pt-4">
                    {/* ===== Tabel barang (inv_barang) ===== */}
                    <TabContent value="barang">
                        <div className="overflow-x-auto">
                            <Table hoverable>
                                <THead>
                                    <Tr>
                                        <Th>No</Th>
                                        <Th>Kode</Th>
                                        <Th>Nama barang</Th>
                                        <Th>Kategori</Th>
                                        <Th>Lokasi</Th>
                                        <Th>Jumlah</Th>
                                        <Th>Tersedia</Th>
                                        <Th>Kondisi</Th>
                                        <Th />
                                    </Tr>
                                </THead>
                                <TBody>
                                    {fBarang.length === 0 && <EmptyRow cols={9} />}
                                    {paginate(fBarang, page).map((b, i) => (
                                        <Tr key={b.replid}>
                                            <Td>{(page - 1) * PAGE_SIZE + i + 1}</Td>
                                            <Td>{b.kode_barang}</Td>
                                            <Td>{b.nama_barang}</Td>
                                            <Td>{namaKategori(b.kategori_id)}</Td>
                                            <Td>{namaLokasi(b.lokasi_id)}</Td>
                                            <Td>{b.jumlah_barang} {b.satuan}</Td>
                                            <Td className={b.jumlah_tersedia === 0 ? 'font-semibold text-red-500' : ''}>
                                                {b.jumlah_tersedia} {b.satuan}
                                            </Td>
                                            <Td>
                                                <Tag className={`border-0 ${kondisiClass[b.kondisi] ?? ''}`}>{b.kondisi}</Tag>
                                            </Td>
                                            <Td><DeleteButton onClick={() => hapusBarang(b)} /></Td>
                                        </Tr>
                                    ))}
                                </TBody>
                            </Table>
                        </div>
                    </TabContent>

                    {/* ===== Tabel barang masuk (inv_barang_masuk) ===== */}
                    <TabContent value="masuk">
                        <div className="overflow-x-auto">
                            <Table hoverable>
                                <THead>
                                    <Tr>
                                        <Th>No</Th>
                                        <Th>Tanggal masuk</Th>
                                        <Th>Barang</Th>
                                        <Th>Jumlah</Th>
                                        <Th>Sumber</Th>
                                        <Th>Keterangan</Th>
                                        <Th />
                                    </Tr>
                                </THead>
                                <TBody>
                                    {fMasuk.length === 0 && <EmptyRow cols={7} />}
                                    {paginate(fMasuk, page).map((m, i) => (
                                        <Tr key={m.replid}>
                                            <Td>{(page - 1) * PAGE_SIZE + i + 1}</Td>
                                            <Td>{fmtTanggal(m.tgl_masuk)}</Td>
                                            <Td>{infoBarang(m.barang_id)}</Td>
                                            <Td>{m.jumlah} {satuan(m.barang_id)}</Td>
                                            <Td>{m.sumber}</Td>
                                            <Td>{m.keterangan || '-'}</Td>
                                            <Td><DeleteButton onClick={() => hapusMasuk(m)} /></Td>
                                        </Tr>
                                    ))}
                                </TBody>
                            </Table>
                        </div>
                    </TabContent>

                    {/* ===== Tabel barang keluar (inv_barang_keluar) ===== */}
                    <TabContent value="keluar">
                        <div className="overflow-x-auto">
                            <Table hoverable>
                                <THead>
                                    <Tr>
                                        <Th>No</Th>
                                        <Th>Tanggal keluar</Th>
                                        <Th>Barang</Th>
                                        <Th>Jumlah</Th>
                                        <Th>Alasan keluar</Th>
                                        <Th>Keterangan</Th>
                                        <Th />
                                    </Tr>
                                </THead>
                                <TBody>
                                    {fKeluar.length === 0 && <EmptyRow cols={7} />}
                                    {paginate(fKeluar, page).map((k, i) => (
                                        <Tr key={k.replid}>
                                            <Td>{(page - 1) * PAGE_SIZE + i + 1}</Td>
                                            <Td>{fmtTanggal(k.tgl_keluar)}</Td>
                                            <Td>{infoBarang(k.barang_id)}</Td>
                                            <Td>{k.jumlah} {satuan(k.barang_id)}</Td>
                                            <Td>{k.alasan_keluar}</Td>
                                            <Td>{k.keterangan || '-'}</Td>
                                            <Td><DeleteButton onClick={() => hapusKeluar(k)} /></Td>
                                        </Tr>
                                    ))}
                                </TBody>
                            </Table>
                        </div>
                    </TabContent>
                </div>
            </Tabs>

            <div className="mt-4 flex justify-end">
                <Pagination total={total} pageSize={PAGE_SIZE} currentPage={page} onChange={setPage} />
            </div>

            {dialogOpen && (
                <FormDialog
                    title={form.title}
                    fields={form.fields}
                    onClose={() => setDialogOpen(false)}
                    onSubmit={form.submit}
                />
            )}
        </Card>
    )
}

export default StokBarang
