'use client'

import { useState } from 'react'
import Table from '@/components/ui/Table'
import {
    dataBarang, dataDetail, dataLokasi, dataPeminjaman, dataPelajaran,
    inRange, ReportCard, DateRange, EmptyRow,
} from '@/views/report/report-shared'

const { Tr, Th, Td, THead, TBody } = Table

const namaHari = (v: string) => new Date(v).toLocaleDateString('id-ID', { weekday: 'long' }).toLowerCase()

const PemakaianPerPelajaran = () => {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')

    const lokasi = (id: number) => dataLokasi.find((l) => l.replid === id)?.nama_ruangan ?? '-'
    const namaBarang = (id: number) => dataBarang.find((b) => b.replid === id)?.nama_barang ?? '-'

    // Pemakaian = peminjaman di ruangan yang sama, pada hari dan jam pelajaran tersebut.
    const rows = dataPelajaran.map((p) => {
        const mulai = p.waktu_mulai.slice(0, 5)
        const selesai = p.waktu_berakhir.slice(0, 5)
        const sesi = dataPeminjaman.filter(
            (m) =>
                m.lokasi_id === p.lokasi_id &&
                namaHari(m.tgl_peminjaman) === p.hari.toLowerCase() &&
                m.tgl_peminjaman.slice(11, 16) >= mulai &&
                m.tgl_peminjaman.slice(11, 16) < selesai &&
                inRange(m.tgl_peminjaman, from, to),
        )
        const detail = dataDetail.filter((d) => sesi.some((m) => m.replid === d.peminjaman_id))
        const perBarang = new Map<number, number>()
        detail.forEach((d) => perBarang.set(d.barang_id, (perBarang.get(d.barang_id) ?? 0) + d.jumlah))
        return {
            p,
            mulai,
            selesai,
            jumlahSesi: sesi.length,
            unit: detail.reduce((s, d) => s + d.jumlah, 0),
            barang: Array.from(perBarang).map(([id, j]) => `${namaBarang(id)} x ${j}`).join(', '),
        }
    })

    return (
        <ReportCard title="Laporan pemakaian per pelajaran" filters={<DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />}>
            <div className="overflow-x-auto">
                <Table hoverable>
                    <THead>
                        <Tr>
                            <Th>No</Th>
                            <Th>Pelajaran</Th>
                            <Th>Kelas</Th>
                            <Th>Jadwal</Th>
                            <Th>Ruangan</Th>
                            <Th>Jumlah peminjaman</Th>
                            <Th>Total barang dipakai</Th>
                            <Th>Barang yang dipakai</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {rows.length === 0 && <EmptyRow cols={8} />}
                        {rows.map((r, i) => (
                            <Tr key={r.p.replid}>
                                <Td>{i + 1}</Td>
                                <Td>{r.p.nama_pelajaran}</Td>
                                <Td>{r.p.kelas}</Td>
                                <Td>{r.p.hari}, {r.mulai}-{r.selesai}</Td>
                                <Td>{lokasi(r.p.lokasi_id)}</Td>
                                <Td>{r.jumlahSesi}</Td>
                                <Td>{r.unit}</Td>
                                <Td>{r.barang || '-'}</Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div>
            <p className="mt-3 text-sm">
                Pemakaian dihitung dari peminjaman di ruangan yang sama, pada hari dan jam pelajaran.
            </p>
        </ReportCard>
    )
}

export default PemakaianPerPelajaran
