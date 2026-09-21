import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
    '/home': {
        key: 'home',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    // 👇 Rute dashboard kita daftarkan sesuai aturan tipe yang benar 👇
    '/dashboard': {
        key: 'dashboard',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    // 👇 Rute modul Inventaris didaftarkan di sini agar tidak "hilang" saat RBAC diaktifkan
    '/inventaris/ruangan-lab': {
        key: 'inventaris.ruanganLab',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/inventaris/ruangan': {
        key: 'inventaris.ruangan',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/inventaris/barang': {
        key: 'inventaris.barang',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/inventaris/pelajaran': {
        key: 'inventaris.pelajaran',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

export const publicRoutes: Routes = {}

export const authRoutes = authRoute