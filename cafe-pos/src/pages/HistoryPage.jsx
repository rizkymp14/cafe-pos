import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Import axios
import { toast } from 'react-hot-toast'; // 2. Import toast
import './HistoryPage.css';

// URL Backend
const BACKEND_URL = 'http://localhost:4000';

// 3. Hapus 'transactions' dari props
function HistoryPage() { 
  // 4. Buat state sendiri untuk menyimpan transaksi
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 5. Gunakan useEffect untuk mengambil data saat halaman dimuat
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/transactions`);
        // Pastikan 'items' yang berupa JSON string di-parse
        const parsedData = response.data.map(trans => ({
          ...trans,
          items: typeof trans.items === 'string' ? JSON.parse(trans.items) : trans.items
        }));
        setTransactions(parsedData);
      } catch (error) {
        console.error("Error mengambil riwayat:", error);
        toast.error("Gagal memuat riwayat transaksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []); // [] = jalankan sekali saat halaman dibuka

  const renderOrderInfo = (trans) => {
    if (trans.order_type === 'Dine In') { // 6. Sesuaikan nama kolom (dari DB)
      return `Dine In - Meja ${trans.table_number}`;
    }
    return 'Take Away';
  };

  // 7. Tampilkan pesan loading
  if (loading) {
    return <div className="history-container"><p>Memuat riwayat...</p></div>;
  }

  return (
    <div className="history-container">
      <h1>Riwayat Transaksi</h1>
      
      {transactions.length === 0 ? (
        <p>Belum ada transaksi yang tercatat.</p>
      ) : (
        <div className="transaction-list">
          {/* Kita tidak perlu .reverse() lagi, DB sudah mengurutkan */}
          {transactions.map((trans) => (
            <div key={trans.id} className="transaction-card">
              <div className="card-header">
                <span className="order-type-info">{renderOrderInfo(trans)}</span>
                <span className="timestamp">{new Date(trans.timestamp).toLocaleString('id-ID')}</span>
              </div>
              
              <div className="card-body">
                <ul>
                  {/* Cek jika 'items' ada sebelum di-map */}
                  {trans.items && trans.items.map(item => (
                    <li key={item.id}>
                      <div className="item-info">
                        <span>{item.qty}x {item.name}</span>
                        {item.note && (
                          <span className="history-item-note">Catatan: {item.note}</span>
                        )}
                      </div>
                      <span>Rp {(item.qty * item.price).toLocaleString('id-ID')}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="card-footer">
                <span>Metode Bayar: {trans.payment_method}</span> {/* Sesuaikan nama kolom */}
                <span className="total">Total: Rp {trans.total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;