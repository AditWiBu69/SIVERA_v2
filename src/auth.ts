import NextAuth from 'next-auth'
import appConfig from '@/configs/app.config'
import authConfig from '@/configs/auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
    // AUTH_SECRET WAJIB diisi di .env.local (lihat .env.example).
    // Tanpa ini, Auth.js akan melempar error "MissingSecret".
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: appConfig.authenticatedEntryPath,
        error: appConfig.authenticatedEntryPath,
    },
    ...authConfig,
})
