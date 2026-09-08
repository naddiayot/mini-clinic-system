
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

async function seed() {
  try {
    const users = [
      { name: 'Administrator', email: 'admin@clinic.com', password: 'admin123', role: 'admin' },
      { name: 'Dr. Budi', email: 'dokter@clinic.com', password: 'dokter123', role: 'dokter' },
      { name: 'Petugas Siti', email: 'petugas@clinic.com', password: 'petugas123', role: 'petugas_pendaftaran' },
    ];

    for (const user of users) {
      // Cek apakah email sudah ada, supaya script ini aman dijalankan berkali-kali
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [user.email]);

      if (existing.rows.length > 0) {
        console.log(`⏭️  Akun ${user.email} sudah ada, dilewati.`);
        continue;
      }

      // Hash password sebelum disimpan (angka 10 = tingkat kerumitan hash)
      const passwordHash = await bcrypt.hash(user.password, 10);

      await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        [user.name, user.email, passwordHash, user.role]
      );

      console.log(`✅ Akun ${user.role} berhasil dibuat: ${user.email} / ${user.password}`);
    }

    // Tambahan: bikin 1 data dokter di tabel 'doctors' juga,
    // supaya bisa langsung dipakai untuk testing modul pendaftaran nanti
    const doctorExists = await pool.query('SELECT id FROM doctors LIMIT 1');
    if (doctorExists.rows.length === 0) {
      await pool.query(
        'INSERT INTO doctors (name, specialization) VALUES ($1, $2)',
        ['Dr. Budi', 'Umum']
      );
      console.log('✅ Data dokter (untuk pendaftaran) berhasil dibuat');
    }

    console.log('🎉 Seeding selesai!');
  } catch (err) {
    console.error('❌ Gagal seeding:', err.message);
  } finally {
    pool.end(); // tutup koneksi supaya script berhenti otomatis
  }
}

seed();