// 1. Import package
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Koneksi database

// 2. Inisialisasi aplikasi express
const app = express();
const PORT = 4000;

// 3. Terapkan middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 4. Definisikan route (rute)
app.get('/', (req, res) => {
  res.send('Halo! Ini adalah server backend POS Kafe.');
});

// API Endpoint untuk MENGAMBIL PRODUK
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('Error mengambil produk:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// API Endpoint untuk MENYIMPAN TRANSAKSI
app.post('/api/transactions', async (req, res) => {
  let connection;
  try {
    const { cart, total, orderInfo } = req.body;
    const { paymentMethod, orderType, tableNumber, amountPaid, change } = orderInfo;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const transactionQuery = `
      INSERT INTO transactions 
      (total, payment_method, order_type, table_number, amount_paid, change_amount) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [transactionResult] = await connection.query(transactionQuery, [
      total,
      paymentMethod,
      orderType,
      tableNumber,
      amountPaid,
      change
    ]);
    
    const transactionId = transactionResult.insertId;

    const itemPromises = cart.map(item => {
      const itemQuery = `
        INSERT INTO transaction_items 
        (transaction_id, product_id, product_name, qty, price, note) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      return connection.query(itemQuery, [
        transactionId,
        item.id,
        item.name,
        item.qty,
        item.price,
        item.note
      ]);
    });
    
    await Promise.all(itemPromises);
    await connection.commit();
    
    res.status(201).json({ 
      message: 'Transaksi berhasil disimpan!', 
      transactionId: transactionId 
    });

  } catch (error) {
    console.error('Error menyimpan transaksi:', error);
    if (connection) {
      await connection.rollback();
    }
    res.status(500).json({ message: 'Gagal menyimpan transaksi' });
    
  } finally {
    if (connection) {
      connection.release();
    }
  }
});


app.get('/api/transactions', async (req, res) => {
  try {
    // 1. Ambil semua data transaksi utama
    const [transactions] = await pool.query('SELECT * FROM transactions ORDER BY timestamp DESC');
    
    // 2. Ambil semua data item dari semua transaksi
    const [items] = await pool.query('SELECT * FROM transaction_items');
    
    // 3. Gabungkan datanya menggunakan JavaScript
    const responseData = transactions.map(trans => {
      // Temukan item yang cocok untuk setiap transaksi
      const transactionItems = items
        .filter(item => item.transaction_id === trans.id)
        .map(item => ({
          // Ganti nama properti agar cocok dengan yang diharapkan frontend
          id: item.id,
          qty: item.qty,
          price: item.price,
          note: item.note,
          name: item.product_name 
        }));
      
      return {
        ...trans,
        items: transactionItems // Tambahkan array 'items' ke setiap transaksi
      };
    });
    
    // 4. Kirim data yang sudah digabungkan
    res.json(responseData);

  } catch (error) {
    console.error('Error mengambil riwayat transaksi (versi baru):', error);
    res.status(500).json({ message: 'Gagal mengambil riwayat transaksi' });
  }
});


// 5. Jalankan server
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});