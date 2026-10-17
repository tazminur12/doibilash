"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit,
  Trash,
  ChevronLeft,
  ChevronRight,
  Package,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

interface ProductRecord {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  price: string;
  priceNum: number;
  stockStatus: "In Stock" | "Out of Stock";
  image: string;
  unit: string;
}

const INITIAL_PRODUCTS: ProductRecord[] = [
  {
    id: "PROD-001",
    name: "বগুড়ার স্পেশাল সরার দই",
    nameEn: "Special Bogura Shorar Doi",
    category: "প্রিমিয়াম দই",
    price: "৳ ৫০০",
    priceNum: 500,
    stockStatus: "In Stock",
    image:
      "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=150&q=80",
    unit: "১ কেজি সরা",
  },
  {
    id: "PROD-002",
    name: "খাঁটি দানাদার গাওয়া ঘি",
    nameEn: "Pure Danadar Gawa Ghee",
    category: "খাঁটি গাওয়া ঘি",
    price: "৳ ৯৫০",
    priceNum: 950,
    stockStatus: "In Stock",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=150&q=80",
    unit: "৫০০ গ্রাম জার",
  },
  {
    id: "PROD-003",
    name: "ঐতিহ্যবাহী ঘি-এ ভাজা মতিচুর লাড্ডু",
    nameEn: "Traditional Motichoor Laddu",
    category: "লাড্ডু",
    price: "৳ ৫৫০",
    priceNum: 550,
    stockStatus: "In Stock",
    image:
      "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=150&q=80",
    unit: "১ কেজি বক্স",
  },
  {
    id: "PROD-004",
    name: "মাটির হাঁড়ির মিষ্টি দই",
    nameEn: "Clay Pot Sweet Curd",
    category: "প্রিমিয়াম দই",
    price: "৳ ৪২০",
    priceNum: 420,
    stockStatus: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=150&q=80",
    unit: "৫০০ গ্রাম হাঁড়ি",
  },
  {
    id: "PROD-005",
    name: "ঐতিহ্যবাহী নরম স্পঞ্জ রসগোল্লা",
    nameEn: "Traditional Sponge Rosogolla",
    category: "ঐতিহ্যবাহী মিষ্টি",
    price: "৳ ৬০০",
    priceNum: 600,
    stockStatus: "In Stock",
    image:
      "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=150&q=80",
    unit: "১ কেজি বক্স",
  },
  {
    id: "PROD-006",
    name: "স্পেশাল প্রিমিয়াম লাচ্ছা সেমাই",
    nameEn: "Special Premium Laccha Semai",
    category: "লাচ্ছা সেমাই",
    price: "৳ ৪৫০",
    priceNum: 450,
    stockStatus: "In Stock",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80",
    unit: "৫০০ গ্রাম প্যাকেট",
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("প্রিমিয়াম দই");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState<"In Stock" | "Out of Stock">("In Stock");

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.includes(searchQuery)
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory("প্রিমিয়াম দই");
    setFormPrice("");
    setFormStock("In Stock");
    setIsModalOpen(true);
  };

  const openEditModal = (prod: ProductRecord) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormPrice(String(prod.priceNum));
    setFormStock(prod.stockStatus);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`আপনি কি "${name}" পণ্যটি তালিকা থেকে মুছে ফেলতে চান?`)) {
      setProducts((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? {
                ...item,
                name: formName,
                category: formCategory,
                price: `৳ ${Number(formPrice).toLocaleString()}`,
                priceNum: Number(formPrice),
                stockStatus: formStock,
              }
            : item
        )
      );
    } else {
      const newProd: ProductRecord = {
        id: `PROD-${Date.now().toString().slice(-3)}`,
        name: formName,
        nameEn: formName,
        category: formCategory,
        price: `৳ ${Number(formPrice).toLocaleString()}`,
        priceNum: Number(formPrice),
        stockStatus: formStock,
        image:
          "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=150&q=80",
        unit: "১ টি",
      };
      setProducts((prev) => [...prev, newProd]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 font-bengali space-y-6">
      {/* ── 1. Header & Actions ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="font-bengali text-3xl font-bold text-gray-800 tracking-tight">
            পণ্য তালিকা
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            দই বিলাসের সকল পণ্যের স্টক, মূল্য এবং বিবরণ পরিচালনা করুন
          </p>
        </div>

        {/* Right: Search Input + Add New Product Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য খুঁজুন..."
              className="w-full sm:w-64 border border-gray-200 focus:border-doibrand-gold ring-0 rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm font-bengali text-gray-800 placeholder-gray-400 outline-none transition-colors bg-white shadow-xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* '+ নতুন পণ্য যুক্ত করুন' Button */}
          <button
            type="button"
            onClick={openAddModal}
            className="bg-doibrand-dark text-white hover:bg-doibrand-gold px-4 py-2 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ নতুন পণ্য যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* ── 2. Products Data Table (Desktop View: hidden md:block) ──────── */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            {/* Table Header */}
            <thead className="bg-gray-50 text-gray-600 font-semibold text-sm py-4 px-6 text-left border-b border-gray-200">
              <tr>
                <th className="py-4 px-6 text-left w-20">Image</th>
                <th className="py-4 px-6 text-left">Product Name</th>
                <th className="py-4 px-6 text-left">Category</th>
                <th className="py-4 px-6 text-left">Price</th>
                <th className="py-4 px-6 text-left">Stock Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => {
                  const isInStock = prod.stockStatus === "In Stock";

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-stone-50/70 transition-colors group"
                    >
                      {/* Image Column */}
                      <td className="py-4 px-6">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden object-cover border border-gray-100 bg-stone-50 shrink-0">
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      </td>

                      {/* Product Name Column */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-doibrand-dark text-sm">
                          {prod.name}
                        </div>
                        <div className="text-xs text-gray-400 font-sans mt-0.5">
                          {prod.unit}
                        </div>
                      </td>

                      {/* Category Column */}
                      <td className="py-4 px-6 text-xs text-gray-600 font-medium">
                        <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md">
                          {prod.category}
                        </span>
                      </td>

                      {/* Price Column */}
                      <td className="py-4 px-6 font-bold font-sans text-doibrand-accent text-base">
                        {prod.price}
                      </td>

                      {/* Stock Status Badges */}
                      <td className="py-4 px-6">
                        {isInStock ? (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium inline-flex items-center">
                            In Stock
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium inline-flex items-center">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(prod)}
                            title="সম্পাদনা করুন"
                            className="text-blue-500 hover:bg-blue-50 p-2 rounded-md cursor-pointer transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(prod.id, prod.name)}
                            title="মুছে ফেলুন"
                            className="text-red-500 hover:bg-red-50 p-2 rounded-md cursor-pointer transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <span>কোনো পণ্য পাওয়া যায়নি</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 3. Mobile View Handling (block md:hidden) ─────────────────── */}
      <div className="block md:hidden space-y-4 mt-6">
        {filteredProducts.map((prod) => {
          const isInStock = prod.stockStatus === "In Stock";

          return (
            <div
              key={prod.id}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between gap-3"
            >
              {/* Product Info Row */}
              <div className="flex items-start gap-3.5">
                {/* Product Image on Left */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 bg-stone-50 shrink-0">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                {/* Name & Price on Right */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-doibrand-dark truncate">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{prod.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold font-sans text-sm text-doibrand-accent">
                      {prod.price}
                    </span>
                    {isInStock ? (
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        In Stock
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons at bottom right corner */}
              <div className="pt-2 border-t border-gray-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(prod)}
                  className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md font-semibold transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>এডিট</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(prod.id, prod.name)}
                  className="flex items-center gap-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md font-semibold transition-colors"
                >
                  <Trash className="w-3.5 h-3.5" />
                  <span>মুছুন</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 4. Pagination ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          সর্বমোট <strong className="font-bold text-gray-800">{filteredProducts.length}</strong> টি পণ্যের মধ্যে{" "}
          <strong className="font-bold text-gray-800">১-৬</strong> দেখানো হচ্ছে
        </p>

        <div className="flex items-center gap-1.5">
          {/* Previous Button */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {/* Page Numbers */}
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className={`px-3 py-1.5 text-xs font-semibold ${
              currentPage === 1
                ? "bg-doibrand-dark text-white rounded-md"
                : "text-gray-600 hover:bg-gray-100 rounded-md"
            }`}
          >
            1
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(2)}
            className={`px-3 py-1.5 text-xs font-semibold ${
              currentPage === 2
                ? "bg-doibrand-dark text-white rounded-md"
                : "text-gray-600 hover:bg-gray-100 rounded-md"
            }`}
          >
            2
          </button>

          {/* Next Button */}
          <button
            type="button"
            disabled={currentPage === 2}
            onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Modal: Add / Edit Product ───────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-doibrand-dark">
                {editingProduct ? "পণ্য সম্পাদনা করুন" : "নতুন পণ্য যুক্ত করুন"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  পণ্যের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="যেমন: বগুড়ার স্পেশাল সরার দই"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold font-bengali"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  ক্যাটাগরি *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold font-bengali bg-white"
                >
                  <option value="প্রিমিয়াম দই">প্রিমিয়াম দই</option>
                  <option value="খাঁটি গাওয়া ঘি">খাঁটি গাওয়া ঘি</option>
                  <option value="লাড্ডু">লাড্ডু</option>
                  <option value="ঐতিহ্যবাহী মিষ্টি">ঐতিহ্যবাহী মিষ্টি</option>
                  <option value="লাচ্ছা সেমাই">লাচ্ছা সেমাই</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  মূল্য (টাকা) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="যেমন: ৫০০"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm font-sans focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  স্টক অবস্থা *
                </label>
                <select
                  value={formStock}
                  onChange={(e) =>
                    setFormStock(e.target.value as "In Stock" | "Out of Stock")
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold font-sans bg-white"
                >
                  <option value="In Stock">In Stock (মজুদ আছে)</option>
                  <option value="Out of Stock">Out of Stock (স্টক শেষ)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-doibrand-dark text-white rounded-xl text-sm font-semibold hover:bg-stone-900 transition-colors cursor-pointer"
                >
                  {editingProduct ? "সংরক্ষণ করুন" : "যুক্ত করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
