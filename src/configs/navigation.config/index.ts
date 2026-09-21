import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'dashboard',
        path: '/dashboard', // Rute menuju halaman Dashboard
        title: 'Dashboard',
        translateKey: 'nav.dashboard',
        icon: 'dashboard', // Sesuai dengan key di konfigurasi icon
        type: NAV_ITEM_TYPE_ITEM,
        authority: [], // Kosongkan agar bisa diakses semua role, atau isi ['Admin'] nanti sesuai BRD
        subMenu: [],
    },
    {
        key: 'inventaris',
        // PERBAIKAN: Mengubah lokasi file menjadi string kosong 
        // karena ini adalah menu Collapse (induk), sama seperti Transaksi.
        path: '', 
        title: 'Menu Inventaris',
        translateKey: 'nav.inventaris.menu',
        icon: 'inventaris',
        type: NAV_ITEM_TYPE_COLLAPSE, // Menggunakan COLLAPSE karena memiliki sub-menu
        authority: [],
        subMenu: [
            {
                key: 'inventaris.ruanganLab',
                path: '/inventaris/ruangan-lab', // Ini URL yang benar untuk halamannya
                title: 'Ruangan Lab',
                translateKey: 'nav.inventaris.ruanganLab',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'inventaris.ruangan',
                path: '/inventaris/ruangan',
                title: 'Ruangan',
                translateKey: 'nav.inventaris.ruangan',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'inventaris.barang',
                path: '/inventaris/barang',
                title: 'Barang',
                translateKey: 'nav.inventaris.barang',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'inventaris.pelajaran',
                path: '/inventaris/pelajaran',
                title: 'Pelajaran',
                translateKey: 'nav.inventaris.pelajaran',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'transaksi',
        path: '',
        title: 'Transaksi',
        translateKey: 'nav.transaksi.menu',
        icon: 'transaksi',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'transaksi.barangMasuk',
                path: '/transaksi/barang-masuk',
                title: 'Barang Masuk',
                translateKey: 'nav.transaksi.barangMasuk',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'transaksi.barangKeluar',
                path: '/transaksi/barang-keluar',
                title: 'Barang Keluar',
                translateKey: 'nav.transaksi.barangKeluar',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'transaksi.peminjamanBarang',
                path: '/transaksi/peminjaman-barang',
                title: 'Peminjaman Barang',
                translateKey: 'nav.transaksi.peminjamanBarang',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'views',
        path: '/views',
        title: 'Views',
        translateKey: 'nav.views',
        icon: 'views',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'report',
        path: '/report',
        title: 'Report',
        translateKey: 'nav.report',
        icon: 'report',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'masterData',
        path: '/master-data',
        title: 'Master Data',
        translateKey: 'nav.masterData',
        icon: 'masterData',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default navigationConfig