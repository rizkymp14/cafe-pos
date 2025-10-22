// src/data/products.js

// Tahap 1: Impor semua gambar dari folder assets
import espressoImg from '../assets/images/espresso.jpg';
import americanoImg from '../assets/images/americano.jpg';
import latteImg from '../assets/images/latte.jpg';
import redVelvetImg from '../assets/images/red-velvet.jpg';
import matchaLatteImg from '../assets/images/matcha-latte.jpg';
import croissantImg from '../assets/images/croissant.jpg';
import frenchFriesImg from '../assets/images/french-fries.jpg';
import pisangGorengImg from '../assets/images/pisang-goreng.jpg';
import nasiGorengImg from '../assets/images/nasi-goreng.jpg';
import mieGorengImg from '../assets/images/mie-goreng.jpg';


// Tahap 2: Gunakan variabel hasil impor di dalam data produk
export const products = [
  // Kategori Kopi
  { id: 1, name: 'Espresso', price: 15000, category: 'Kopi', image: espressoImg },
  { id: 2, name: 'Americano', price: 18000, category: 'Kopi', image: americanoImg },
  { id: 3, name: 'Latte', price: 22000, category: 'Kopi', image: latteImg },
  
  // Kategori Non-Kopi
  { id: 4, name: 'Red Velvet', price: 25000, category: 'Non-Kopi', image: redVelvetImg },
  { id: 5, name: 'Matcha Latte', price: 24000, category: 'Non-Kopi', image: matchaLatteImg },

  // Kategori Cemilan
  { id: 6, name: 'Croissant', price: 20000, category: 'Cemilan', image: croissantImg },
  { id: 7, name: 'French Fries', price: 18000, category: 'Cemilan', image: frenchFriesImg },
  { id: 8, name: 'Pisang Goreng', price: 15000, category: 'Cemilan', image: pisangGorengImg },

  // Kategori Makanan Berat
  { id: 9, name: 'Nasi Goreng', price: 35000, category: 'Makanan', image: nasiGorengImg },
  { id: 10, name: 'Mie Goreng', price: 32000, category: 'Makanan', image: mieGorengImg }
];

// Daftar kategori tetap sama
export const categories = ['Semua', 'Kopi', 'Non-Kopi', 'Cemilan', 'Makanan'];