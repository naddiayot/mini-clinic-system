Mini Clinic Information System

Mini Clinic Information System merupakan aplikasi berbasis web yang digunakan untuk membantu proses administrasi dan pelayanan pasien pada klinik pratama.

Aplikasi ini mencakup pengelolaan data pasien, pendaftaran kunjungan, pengelolaan antrean, pemeriksaan dokter, tindakan medis, resep obat, riwayat pemeriksaan, dan dashboard.

Teknologi

React.js

Node.js

Express.js

PostgreSQL

JSON Web Token (JWT)

Git

Fitur Utama

Login dan logout

Authentication menggunakan JWT

Authorization berdasarkan role

Pengelolaan data pasien

Pendaftaran kunjungan pasien

Pengelolaan antrean pasien

Pemeriksaan dokter menggunakan metode SOAP

Input tindakan medis

Input resep obat

Riwayat pemeriksaan pasien

Dashboard klinik

Role Pengguna

Administrator

Dokter

Petugas Pendaftaran

Struktur Project

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
├── database/
│   └── mini_clinic_db.sql
│
├── ERD_mini_clinic.png
├── mini-clinic-postman-collection.json
├── .gitignore
└── README.md

Cara Menjalankan Project

1. Persiapan Database

Pastikan PostgreSQL sudah terpasang dan sedang berjalan.

Buat database PostgreSQL sesuai nama database yang digunakan pada konfigurasi backend/.env.

File database tersedia pada:

database/mini_clinic_db.sql

Import file mini_clinic_db.sql ke PostgreSQL menggunakan pgAdmin atau tools PostgreSQL lainnya.

2. Menjalankan Backend

Masuk ke folder backend:

cd backend

Install seluruh dependency:

npm install

Buat file .env berdasarkan file .env.example, kemudian sesuaikan konfigurasi PostgreSQL dan JWT.

Jalankan backend dengan:

node server.js

Backend berjalan pada:

http://localhost:5000

3. Menjalankan Frontend

Buka terminal baru, kemudian masuk ke folder frontend:

cd frontend

Install dependency:

npm install

Buat file .env berdasarkan file .env.example.

Jalankan frontend dengan:

npm run dev

Frontend akan berjalan pada alamat yang ditampilkan oleh Vite, biasanya:

http://localhost:5173

Konfigurasi Environment

Backend

Buat file:

backend/.env

berdasarkan:

backend/.env.example

Contoh konfigurasi:

PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=your_database

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

Frontend

Buat file:

frontend/.env

berdasarkan:

frontend/.env.example

Contoh konfigurasi:

VITE_API_URL=http://localhost:5000/api

File .env tidak disertakan dalam repository karena dapat berisi informasi sensitif seperti password database dan JWT secret.

Database

Sistem menggunakan PostgreSQL sebagai database.

File SQL database tersedia pada:

database/mini_clinic_db.sql

File tersebut digunakan untuk membuat struktur database dan menyediakan data yang diperlukan untuk pengujian sistem.

Seed Data

Project menyediakan seed data pada:

backend/scripts/seed.js

Seed digunakan untuk membuat data awal yang diperlukan untuk pengujian sistem, termasuk akun pengguna dan data dokter.

Untuk menjalankan seed:

cd backend
node scripts/seed.js

Akun Login

Akun berikut dapat digunakan untuk melakukan pengujian sistem:

Role

Email

Password

Administrator

admin@clinic.com

admin123

Dokter

dokter@clinic.com

dokter123

Petugas Pendaftaran

petugas@clinic.com

petugas123

Dokumentasi Pendukung

ERD

Entity Relationship Diagram sistem tersedia pada file:

ERD_mini_clinic.png

Postman Collection

Dokumentasi pengujian REST API tersedia pada file:

mini-clinic-postman-collection.json

Collection tersebut berisi request API yang digunakan dalam sistem, termasuk authentication, pasien, pendaftaran, antrean, rekam medis, dan resep.

Authentication dan Authorization

Sistem menggunakan JSON Web Token (JWT) untuk proses authentication.

Setelah pengguna berhasil login, server memberikan token yang digunakan untuk mengakses endpoint yang membutuhkan autentikasi.

Authorization diterapkan berdasarkan role pengguna, yaitu:

Administrator

Dokter

Petugas Pendaftaran

Hak akses setiap role disesuaikan dengan fungsi masing-masing dalam sistem.

API

Backend menyediakan REST API untuk mendukung proses pengelolaan data pada sistem.

Endpoint utama yang tersedia meliputi:

POST   /api/login
POST   /api/logout

GET    /api/patients
GET    /api/patients/:id
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id

GET    /api/registrations
POST   /api/registrations
PUT    /api/registrations/:id

GET    /api/queues
POST   /api/queues
PUT    /api/queues/:id/call
PUT    /api/queues/:id/status

POST   /api/medical-records
GET    /api/medical-records/:patientId

POST   /api/prescriptions
GET    /api/prescriptions/:id

GET    /api/dashboard
GET    /api/doctors
GET    /api/polyclinics

Git Repository

Project dikembangkan dan dikelola menggunakan Git.

Repository digunakan untuk menyimpan source code frontend, backend, database, dokumentasi, ERD, serta Postman Collection.

File konfigurasi sensitif seperti .env tidak disertakan dalam repository.

Catatan

Sebelum menjalankan aplikasi, pastikan:

PostgreSQL sudah terpasang dan berjalan.

Database sudah dibuat dan file SQL sudah di-import.

File backend/.env sudah dikonfigurasi.

File frontend/.env sudah dikonfigurasi.

Dependency backend dan frontend sudah di-install.