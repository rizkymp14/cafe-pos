// src/db.js
const mysql = require('mysql2');

// Buat koneksi ke database
const pool = mysql.createPool({
  host: 'localhost',      // Alamat server database Anda
  user: 'root',           // Nama pengguna default XAMPP
  password: '',            // Kata sandi default XAMPP (kosong)
  database: 'cafe_pos_db' // Nama database yang kita buat
}).promise();

// Ekspor 'pool' agar bisa digunakan di file lain
module.exports = pool;