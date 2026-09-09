# Mini Clinic Information System

Mini Clinic Information System merupakan aplikasi berbasis web yang digunakan untuk membantu proses administrasi dan pelayanan pasien pada klinik pratama.

Aplikasi ini mencakup pengelolaan data pasien, pendaftaran kunjungan, pengelolaan antrean, pemeriksaan dokter, tindakan medis, resep obat, riwayat pemeriksaan, dan dashboard.

## Teknologi

- React.js
- Node.js
- Express.js
- PostgreSQL
- JSON Web Token (JWT)
- Git

## Fitur Utama

- Login dan logout
- Authentication menggunakan JWT
- Authorization berdasarkan role
- Pengelolaan data pasien
- Pendaftaran kunjungan pasien
- Pengelolaan antrean pasien
- Pemeriksaan dokter menggunakan metode SOAP
- Input tindakan medis
- Input resep obat
- Riwayat pemeriksaan pasien
- Dashboard klinik

## Role Pengguna

- Administrator
- Dokter
- Petugas Pendaftaran

## Struktur Project

```text
mini-clinic-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
└── README.md