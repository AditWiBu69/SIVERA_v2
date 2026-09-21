import {
    PiHouseLineDuotone,
    PiArchiveDuotone,
    PiSwapDuotone,
    PiMonitorDuotone,
    PiChartBarDuotone,
    PiDatabaseDuotone,
} from 'react-icons/pi'
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    // Kunci (key) di sini harus sama persis dengan properti "icon" pada langkah 1
    dashboard: <PiHouseLineDuotone />, // Ikon rumah untuk Dashboard
    inventaris: <PiArchiveDuotone />, // Ikon arsip/inventaris
    transaksi: <PiSwapDuotone />, // Ikon panah bolak-balik untuk Transaksi
    views: <PiMonitorDuotone />, // Ikon monitor untuk Views
    report: <PiChartBarDuotone />, // Ikon diagram untuk Report
    masterData: <PiDatabaseDuotone />, // Ikon database untuk Master Data
}

export default navigationIcon