'use client'

import { useState } from 'react'
import Table from '@/components/ui/Table'
import { dataBarang, dataMasuk, dataKeluar, inRange, ReportCard, DateRange, EmptyRow } from '@/views/report/report-shared'

const { Tr, Th, Td, THead, TBody, TFoot } = Table

const KeluarMasukBarang = () => {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')

    const rows = dataBarang
        .map((b) => ({
            ...b,
            masuk: dataMasuk.filter((m) => m.barang_id === b.replid && inRange(m.tgl_masuk, from, to)).reduce((s, m) => s + m.jumlah, 0),
            keluar: dataKeluar.filter((k) => k.barang_id === b.replid && inRange(k.tgl_keluar, from, to)).reduce((s, k) => s + k.jumlah, 0),
        }))
        .filter((r) => r.masuk > 0 || r.keluar > 0)

    const totalMasuk = rows.reduce((s, r) => s + r.masuk, 0)
    const totalKeluar = rows.reduce((s, r) => s + r.keluar, 0)

    return (
        <ReportCard title="Laporan keluar masuk barang" filters={<DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />}>
            <div className="overflow-x-auto">
                <Table hoverable>
                    <THead>
                        <Tr>
                            <Th>No</Th>
                            <Th>Kode</Th>
                            <Th>Nama barang</Th>
                            <Th>Masuk</Th>
                            <Th>Keluar</Th>
                            <Th>Selisih</Th>
                            <Th>Stok saat ini</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {rows.length === 0 && <EmptyRow cols={7} />}
                        {rows.map((r, i) => (
                            <Tr key={r.replid}>
                                <Td>{i + 1}</Td>
                                <Td>{r.kode_barang}</Td>
                                <Td>{r.nama_barang}</Td>
                                <Td>{r.masuk} {r.satuan}</Td>
                                <Td>{r.keluar} {r.satuan}</Td>
                                <Td className={r.masuk - r.keluar < 0 ? 'text-red-500' : 'text-emerald-600'}>
                                    {r.masuk - r.keluar > 0 ? '+' : ''}{r.masuk - r.keluar}
                                </Td>
                                <Td>{r.jumlah_barang} {r.satuan}</Td>
                            </Tr>
                        ))}
                    </TBody>
                    <TFoot>
                        <Tr>
                            <Td colSpan={3} className="font-semibold">Total</Td>
                            <Td className="font-semibold">{totalMasuk}</Td>
                            <Td className="font-semibold">{totalKeluar}</Td>
                            <Td className="font-semibold">{totalMasuk - totalKeluar}</Td>
                            <Td />
                        </Tr>
                    </TFoot>
                </Table>
            </div>
        </ReportCard>
    )
}

export default KeluarMasukBarang
