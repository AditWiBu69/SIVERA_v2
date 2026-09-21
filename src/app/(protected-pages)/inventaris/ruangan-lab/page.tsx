// Mengimpor React (meski di Next.js terbaru sering kali opsional)
import React from 'react';

// Mengimpor komponen tampilan tabel yang sudah kamu buat sebelumnya.
// PENTING: Perhatikan path/jalur impor ini. Sesuaikan dengan lokasi asli file RuanganLab.tsx-mu.
// Jika lokasinya berbeda dari asumsi di bawah, kamu harus menyesuaikannya.
import RuanganLabView from '@/views/inventaris/ruangan-lab';

export default function RuanganLabPage() {
  return (
    <main>
      {/* Memanggil komponen UI Ruangan Lab agar tampil di halaman ini */}
      <RuanganLabView />
    </main>
  );
}