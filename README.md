# Cafe POS - Sistem Kasir Full Stack

![](https://via.placeholder.com/800x400.png?text=Demo+Aplikasi+POS+Kafe)

## 📖 Deskripsi

**Cafe POS** adalah aplikasi *Point of Sale* (kasir) lengkap yang dibangun dari awal. Proyek ini mensimulasikan alur kerja kasir di kafe atau restoran, mulai dari pemesanan menu, kustomisasi pesanan, hingga pembayaran dan cetak struk.

Aplikasi ini menggunakan arsitektur *full-stack* modern dengan **React** di sisi frontend, **Node.js/Express** di sisi backend, dan **MySQL** sebagai database permanen.

---

## ✨ Fitur Utama

* **Menu Dinamis:** Menampilkan semua produk langsung dari database.
* **Pencarian & Filter:** Mencari produk berdasarkan nama dan memfilter berdasarkan kategori (Kopi, Makanan, Cemilan, dll.).
* **Keranjang Interaktif:** Menambah, mengurangi kuantitas, menghapus item, dan menambahkan **catatan pesanan** (misal: "tidak pedas").
* **Proses Pembayaran:** Modal pembayaran dengan pilihan metode (Tunai, QRIS, Kartu) dan tipe pesanan (Dine In/Take Away).
* **Manajemen Meja:** Input nomor meja untuk pesanan *Dine In*.
* **Perhitungan Kembalian:** Menghitung uang kembalian secara otomatis untuk pembayaran tunai.
* **Cetak Struk:** Memicu dialog cetak browser dengan format struk yang rapi setelah transaksi berhasil.
* **Penyimpanan Permanen:** Semua transaksi yang berhasil disimpan secara permanen ke database MySQL.
* **Riwayat Transaksi:** Halaman terpisah untuk melihat semua riwayat transaksi yang diambil dari database.
* **Notifikasi Toast:** Umpan balik yang modern untuk aksi pengguna (misal: "Transaksi Berhasil!").

---

## 🛠️ Teknologi yang Digunakan

* **Frontend (UI):**
    * React (Vite)
    * React Router DOM
    * Axios
    * React Hot Toast
* **Backend (Server):**
    * Node.js
    * Express
    * CORS
    * `mysql2`
* **Database:**
    * MySQL
    * phpMyAdmin (untuk manajemen)

---

## 🚀 Cara Menjalankan Proyek

Proyek ini terdiri dari dua bagian: **backend** dan **frontend**. Keduanya harus dijalankan secara bersamaan.

### Prasyarat

* [Node.js](https://nodejs.org/) (termasuk npm)
* [XAMPP](https://www.apachefriends.org/index.html) (untuk menjalankan MySQL & phpMyAdmin)

### 1. Setup Database (MySQL)

1.  Buka **XAMPP Control Panel** dan **Start** layanan **MySQL**.
2.  Buka `http://localhost/phpmyadmin` di browser Anda.
3.  Buat database baru dengan nama **`cafe_pos_db`**.
4.  Pilih database `cafe_pos_db`, klik tab **SQL**, dan jalankan query di bawah ini untuk membuat semua tabel:

<details>
  <summary>Klik untuk melihat Query SQL Pembuatan Tabel</summary>
  
  ```sql
  -- Membuat tabel products
  CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    image VARCHAR(500)
  );

  -- Membuat tabel transactions
  CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    total INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    order_type VARCHAR(50) NOT NULL,
    table_number VARCHAR(20) NULL,
    amount_paid INT NOT NULL,
    change_amount INT NOT NULL
  );

  -- Membuat tabel transaction_items
  CREATE TABLE transaction_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    qty INT NOT NULL,
    price INT NOT NULL,
    note VARCHAR(255) NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
  );

  -- (Opsional) Query untuk mengisi data produk
  INSERT INTO products (name, price, category, image) VALUES
  ('Espresso', 15000, 'Kopi', '/images/espresso.jpg'),
  ('Americano', 18000, 'Kopi', '/images/americano.jpg'),
  ('Latte', 22000, 'Kopi', '/images/latte.jpg'),
  ('Red Velvet', 25000, 'Non-Kopi', '/images/red-velvet.jpg'),
  ('Matcha Latte', 24000, 'Non-Kopi', '/images/matcha-latte.jpg'),
  ('Croissant', 20000, 'Cemilan', '/images/croissant.jpg'),
  ('French Fries', 18000, 'Cemilan', '/images/french-fries.jpg'),
  ('Pisang Goreng', 15000, 'Cemilan', '/images/pisang-goreng.jpg'),
  ('Nasi Goreng', 35000, 'Makanan', '/images/nasi-goreng.jpg'),
  ('Mie Goreng', 32000, 'Makanan', '/images/mie-goreng.jpg');
</details>

2. Setup Backend (cafe-pos-backend)
Pindah ke direktori backend:

Bash

cd cafe-pos-backend
Install semua package yang dibutuhkan:

Bash

npm install
PENTING: Salin folder gambar Anda ke dalam folder public/. Strukturnya harus:

cafe-pos-backend/
└── public/
    └── images/
        ├── espresso.jpg
        └── ... (dll)
Jalankan server backend (mode development):

Bash

npm run dev
Server akan berjalan di http://localhost:4000.

3. Setup Frontend (cafe-pos)
Buka terminal baru (biarkan terminal backend tetap berjalan).

Pindah ke direktori frontend:

Bash

cd cafe-pos
Install semua package yang dibutuhkan:

Bash

npm install
Jalankan server frontend:

Bash

npm run dev
Aplikasi akan terbuka di http://localhost:5173.
