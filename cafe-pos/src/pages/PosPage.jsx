import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PaymentModal from '../components/PaymentModal';
import Receipt from '../components/Receipt';
import { toast } from 'react-hot-toast';
import './PosPage.css';

// URL Backend kita. Kita definisikan di atas agar mudah diubah nanti.
const BACKEND_URL = 'http://localhost:4000';

function PosPage({ onTransactionSuccess }) { 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Semua']);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  // Efek untuk mengambil data dari API saat halaman dimuat
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products`);
        
        setProducts(response.data);
        
        const uniqueCategories = [
          'Semua', 
          ...new Set(response.data.map(p => p.category))
        ];
        setCategories(uniqueCategories);

      } catch (error) {
        console.error("Error mengambil data produk:", error);
        toast.error("Gagal memuat menu!");
      }
    };

    fetchProducts();
  }, []);

  
  // --- Fungsi Manajemen Keranjang ---
  const handleIncrease = (itemToIncrease) => {
    setCart(cart.map((item) => item.id === itemToIncrease.id ? { ...item, qty: item.qty + 1 } : item));
  };

  const handleDecrease = (itemToDecrease) => {
    const existingItem = cart.find((item) => item.id === itemToDecrease.id);
    if (existingItem.qty === 1) {
      handleRemove(itemToDecrease);
    } else {
      setCart(cart.map((item) => item.id === itemToDecrease.id ? { ...item, qty: item.qty - 1 } : item));
    }
  };

  const handleRemove = (itemToRemove) => {
    setCart(cart.filter((item) => item.id !== itemToRemove.id));
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      handleIncrease(existingItem);
    } else {
      setCart([...cart, { ...product, qty: 1, note: '' }]);
    }
  };

  const handleEditNote = (itemToEdit) => {
    const newNote = prompt('Masukkan catatan untuk item:', itemToEdit.note || '');
    if (newNote !== null) {
      setCart(cart.map(item => 
        item.id === itemToEdit.id ? { ...item, note: newNote } : item
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  // --- Fungsi Transaksi & Cetak ---
  // --- Fungsi Transaksi & Cetak ---
  const handleTransactionSuccess = async (orderInfo) => { // 1. Tambahkan 'async'
    const transactionId = Date.now();
    const timestamp = new Date();
    const currentTotal = calculateTotal();

    try {
      // 2. Tambahkan 'await'
      // Ini akan "menjeda" fungsi di sini sampai App.jsx selesai
      // mengirim data ke backend.
      await onTransactionSuccess(cart, currentTotal, orderInfo, transactionId, timestamp); 
      
      // 3. Kode di bawah ini hanya akan berjalan jika 'await' selesai
      toast.success('Transaksi Berhasil!');
      
      setReceiptData({
        id: transactionId,
        timestamp: timestamp,
        items: cart,
        total: currentTotal,
        orderInfo: orderInfo
      });
      
      setCart([]); 
      setIsModalOpen(false); 

    } catch (error) {
      // Jika terjadi error saat menyimpan (misalnya dari App.jsx)
      // Kita tetap akan menampilkan toast error, tapi jangan tutup modal
      console.error("Error di handleTransactionSuccess PosPage:", error);
      // toast.error("Gagal memproses transaksi."); // Toast error sudah ada di App.jsx
    }
  };
  
  // 4. useEffect untuk memanggil dialog cetak
  useEffect(() => {
    if (receiptData) {
      window.print();
      setReceiptData(null);
    }
  }, [receiptData]);

  // --- Filter Produk untuk Tampilan ---
  const filteredProducts = products
    .filter(product => {
      return activeCategory === 'Semua' || product.category === activeCategory;
    })
    .filter(product => {
      return product.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const total = calculateTotal();

  return (
    <>
      <div className="pos-container">
        {/* Bagian Daftar Produk */}
        <div className="product-section">
          <div className="search-and-tabs">
            <input 
              type="text"
              placeholder="Cari menu..."
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="category-tabs">
              {categories.map((category) => (
                <button
                  key={category}
                  className={activeCategory === category ? 'active' : ''}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="product-list">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                {/* Perbaikan Path Gambar Produk */}
                <img 
                  src={`${BACKEND_URL}${product.image}`} 
                  alt={product.name} 
                  className="product-image" 
                />
                <div className="product-info">
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p>Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                  <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                    Tambah
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bagian Ringkasan Pesanan */}
        <div className="order-summary">
          <h2>Pesanan</h2>
          {cart.length === 0 ? (
            <p>Keranjang masih kosong.</p>
          ) : (
            <ul className="order-items">
              {cart.map((item) => (
                <li key={item.id} className="order-item">
                  <div className="item-main">
                    {/* Perbaikan Path Gambar Keranjang */}
                    <img 
                      src={`${BACKEND_URL}${item.image}`} 
                      alt={item.name} 
                      className="order-item-image"
                    />
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      {item.note && (
                        <span className="item-note">Catatan: {item.note}</span>
                      )}
                      <span className="item-price">
                        Rp {(item.price * item.qty).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <div className="item-controls">
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => handleDecrease(item)}>-</button>
                      <span className="item-qty">{item.qty}</span>
                      <button className="qty-btn" onClick={() => handleIncrease(item)}>+</button>
                    </div>
                    <div className="action-buttons">
                      <button className="note-btn" onClick={() => handleEditNote(item)}>
                        Catatan
                      </button>
                      <button className="remove-btn" onClick={() => handleRemove(item)}>
                        Hapus
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <hr />
          <div className="total-section">
            <h3>Total</h3>
            <h3>Rp {total.toLocaleString('id-ID')}</h3>
          </div>
          <button
            className="pay-button"
            disabled={cart.length === 0}
            onClick={() => setIsModalOpen(true)}
          >
            Bayar Sekarang
          </button>
        </div>
      </div>

      {/* Modal Pembayaran */}
      {isModalOpen && (
        <PaymentModal
          cart={cart}
          total={total}
          onclose={() => setIsModalOpen(false)}
          onsuccess={handleTransactionSuccess}
        />
      )}
      
      {/* Komponen Struk (Tersembunyi) */}
      <Receipt receipt={receiptData} />
    </>
  );
}

export default PosPage;