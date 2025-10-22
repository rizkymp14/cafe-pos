import React from 'react';
import './Receipt.css';

// Komponen ini menerima data transaksi yang sudah selesai
function Receipt({ receipt }) {
  // Jika tidak ada data struk, jangan render apa-apa
  if (!receipt) return null;

  const { id, timestamp, items, total, orderInfo } = receipt;
  const { paymentMethod, orderType, tableNumber, amountPaid, change } = orderInfo;

  return (
    <div className="receipt-container">
      <h3>Nama Kafe Anda</h3>
      <p>Terima kasih atas kunjungan Anda!</p>
      <hr />
      <p>ID Trans: {id}</p>
      <p>Waktu: {new Date(timestamp).toLocaleString('id-ID')}</p>
      <p>Kasir: (Nama Kasir)</p>
      <hr />
      <div className="receipt-items">
        {items.map(item => (
          <div key={item.id} className="receipt-item">
            <div className="item-name">{item.qty}x {item.name}</div>
            <div className="item-total">Rp {(item.price * item.qty).toLocaleString('id-ID')}</div>
            {item.note && <div className="item-note">Catatan: {item.note}</div>}
          </div>
        ))}
      </div>
      <hr />
      <div className="receipt-summary">
        <p>Subtotal: <span>Rp {total.toLocaleString('id-ID')}</span></p>
        <p>Pajak (10%): <span>(Fitur Nanti)</span></p>
        <p className="total">TOTAL: <span>Rp {total.toLocaleString('id-ID')}</span></p>
      </div>
      <hr />
      <div className="receipt-payment">
        <p>Metode Bayar: <span>{paymentMethod}</span></p>
        {paymentMethod === 'Tunai' && (
          <>
            <p>Tunai Diterima: <span>Rp {Number(amountPaid).toLocaleString('id-ID')}</span></p>
            <p>Kembalian: <span>Rp {change.toLocaleString('id-ID')}</span></p>
          </>
        )}
        <p>Tipe Pesanan: <span>{orderType} {orderType === 'Dine In' ? `- Meja ${tableNumber}` : ''}</span></p>
      </div>
      <hr />
      <p className="footer">Simpan struk ini sebagai bukti pembayaran.</p>
    </div>
  );
}

export default Receipt;