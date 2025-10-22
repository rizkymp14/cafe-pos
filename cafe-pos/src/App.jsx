import React, { useState } from 'react'; // 1. Hapus 'useState'
import { Routes, Route, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import PosPage from './pages/PosPage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

const BACKEND_URL = 'http://localhost:4000';

function App() {
  // 2. HAPUS 'const [transactions, setTransactions] = useState([]);'

  const handleTransactionSuccess = async (cart, total, orderInfo, transactionId, timestamp) => {
    const dataToSend = {
      cart: cart,
      total: total,
      orderInfo: orderInfo
    };

    try {
      const response = await axios.post(`${BACKEND_URL}/api/transactions`, dataToSend);
      console.log('Transaksi berhasil disimpan ke DB, ID:', response.data.transactionId);
      // 3. HAPUS 'setTransactions([...transactions, newTransaction]);'
      // Kita tidak perlu lagi mengelola state riwayat di sini
    } catch (error) {
      console.error("Gagal menyimpan transaksi ke database:", error);
      toast.error("Gagal menyimpan riwayat transaksi!");
      // 4. HAPUS 'setTransactions([...transactions, newTransaction]);' dari blok catch
    }
  };

  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      
      <nav className="main-nav">
        <h1>Nama Kafe POS</h1>
        <div className="nav-links">
          <Link to="/">Kasir</Link>
          <Link to="/riwayat">Riwayat</Link>
        </div>
      </nav>

      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              <PosPage 
                onTransactionSuccess={handleTransactionSuccess} 
              />
            } 
          />
          <Route 
            path="/riwayat" 
            // 5. HAPUS prop 'transactions'
            element={<HistoryPage />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;