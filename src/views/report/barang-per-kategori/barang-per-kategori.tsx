'use client'

import { useState } from 'react'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import { dataBarang, dataKategori, dataLokasi, kondisiClass, ReportCard, EmptyRow } from '@/views/report/report-shared'

const { Tr, Th, Td, THead, TBody } = Table

const options = [
    { value: '0', label: 'Semua kategori' },
    ...dataKategori.map((k) => ({ value: String(k.replid), label: k.nama_kategori })),
]

const BarangPerKategori = () => {
    const [kategoriId, setKategoriId] = useState('0')
    const lokasi = (id: number) => dataLokasi.find((l) => l.replid === id)?.nama_ruangan ?? '-'
    const kategori = dataKategori.filter((k) => kategoriId === '0' || String(k.replid) === kategoriId)

    return (
        <ReportCard
            title="Laporan barang per kategori"
            filters={
                <div className="w-56">
                    <label className="form-label mb-1 block">Kategori</label>
                    <Select
                        options={options}
                        value={options.find((o) => o.value === kategoriId)}
                        onChange={(o) => setKategoriId(o?.value ?? '0')}
                    />
                </div>
            }
        >
            <div className="flex flex-col gap-8">
                {kategori.map((k) => {
                    const items = dataBarang.filter((b) => b.kategori_id === k.replid)
                    const total = items.reduce((s, b) => s + b.jumlah_barang, 0)
                    const tersedia = items.reduce((s, b) => s + b.jumlah_tersedia, 0)
                    return (
                        <section key={k.replid}>
                            <h5>{k.nama_kategori}</h5>
                            <p className="mb-3 text-sm">
                                {items.length} jenis barang, total {total}, tersedia {tersedia}, sedang dipakai {total - tersedia}
                            </p>
                            <div className="overflow-x-auto">
                                <Table hoverable>
                                    <THead>
                                        <Tr>
                                            <Th>No</Th>
                                            <Th>Kode</Th>
                                            <Th>Nama barang</Th>
                                            <Th>Lokasi</Th>
                                            <Th>Jumlah</Th>
                                            <Th>Tersedia</Th>
                                            <Th>Kondisi</Th>
                                        </Tr>
                                    </THead>
                                    <TBody>
                                        {items.length === 0 && <EmptyRow cols={7} />}
                                        {items.map((b, i) => (
                                            <Tr key={b.replid}>
                                                <Td>{i + 1}</Td>
                                                <Td>{b.kode_barang}</Td>
                                                <Td>{b.nama_barang}</Td>
                                                <Td>{lokasi(b.lokasi_id)}</Td>
                                                <Td>{b.jumlah_barang} {b.satuan}</Td>
                                                <Td>{b.jumlah_tersedia} {b.satuan}</Td>
                                                <Td><Tag className={`border-0 ${kondisiClass[b.kondisi] ?? ''}`}>{b.kondisi}</Tag></Td>
                                            </Tr>
                                        ))}
                                    </TBody>
                                </Table>
                            </div>
                        </section>
                    )
                })}
            </div>
        </ReportCard>
    )
}

export default BarangPerKategori
