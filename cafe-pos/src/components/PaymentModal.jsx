import React, { useState } from 'react';
import './PaymentModal.css';

function PaymentModal({ cart, total, onclose, onsuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [amountPaid, setAmountPaid] = useState('');
  const [orderType, setOrderType] = useState('Take Away');
  const [tableNumber, setTableNumber] = useState('');

  const change = amountPaid ? amountPaid - total : 0;

  const handlePayment = () => {
    // Tentukan nilai akhir untuk tunai dan kembalian
    const finalChange = paymentMethod === 'Tunai' ? change : 0;
    const finalAmountPaid = paymentMethod === 'Tunai' ? amountPaid : total;
    
    // Buat objek info yang lengkap
    const orderInfo = {
      paymentMethod,
      orderType,
      tableNumber: orderType === 'Dine In' ? tableNumber : null,
      amountPaid: finalAmountPaid,
      change: finalChange
    };
    
    onsuccess(orderInfo); // Kirim semua info kembali
  };
  
  const isPaymentValid = () => {
    if (orderType === 'Dine In' && tableNumber === '') return true;
    if (paymentMethod === 'Tunai' && amountPaid < total) return true;
    return false;
  };

  if (total === 0) return null;

  return (
    <div className="modal-overlay" onClick={onclose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Rincian Pesanan</h2>
        
        <div className="order-details-list">
          {cart.map(item => (
            <div key={item.id} className="order-details-item" style={{ color: '#000' }}>
              <div className="item-info">
                <span>{item.qty}x {item.name}</span>
                {item.note && (
                  <span className="modal-item-note">Catatan: {item.note}</span>
                )}
              </div>
              <span>Rp {(item.qty * item.price).toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>
        
        <div className="total-display" style={{ color: '#000' }}>
          <span>Total Tagihan:</span>
          <span className="total-amount">Rp {total.toLocaleString('id-ID')}</span>
        </div>

        <div className="order-type">
          <h4>Tipe Pesanan:</h4>
          <div className="payment-methods">
            <button
              className={orderType === 'Take Away' ? 'active' : ''}
              onClick={() => setOrderType('Take Away')}
            >
              Take Away
            </button>
            <button
              className={orderType === 'Dine In' ? 'active' : ''}
              onClick={() => setOrderType('Dine In')}
            >
              Dine In
            </button>
          </div>
        </div>

        {orderType === 'Dine In' && (
          <div className="table-number">
            <label htmlFor="tableNumber">Nomor Meja:</label>
            <input
              type="text"
              id="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Contoh: 12"
            />
          </div>
        )}

        <h4 className="payment-method-title">Metode Pembayaran:</h4>
        <div className="payment-methods">
          <button 
            className={paymentMethod === 'Tunai' ? 'active' : ''} 
            onClick={() => setPaymentMethod('Tunai')}
          >
            Tunai
          </button>
          <button 
            className={paymentMethod === 'QRIS' ? 'active' : ''} 
            onClick={() => setPaymentMethod('QRIS')}
          >
            QRIS
          </button>
          <button 
            className={paymentMethod === 'Kartu' ? 'active' : ''} 
            onClick={() => setPaymentMethod('Kartu')}
          >
            Kartu
          </button>
        </div>

        {paymentMethod === 'Tunai' && (
          <div className="cash-payment">
            <label htmlFor="amountPaid">Uang Diterima:</label>
            <input 
              type="number"
              id="amountPaid"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder="Contoh: 100000"
            />
          </div>
        )}
        
        {paymentMethod === 'Tunai' && amountPaid >= total && (
          <div className="change-display">
            <span>Kembalian:</span>
            <span className="change-amount">Rp {change.toLocaleString('id-ID')}</span>
          </div>
        )}

        <div className="modal-actions">
          <button className="close-btn" onClick={onclose}>Batal</button>
          <button 
            className="confirm-btn" 
            onClick={handlePayment} 
            disabled={isPaymentValid()}
          >
            Selesaikan Transaksi
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;