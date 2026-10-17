"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Cookie,
  Flame,
  Wheat,
  Cake,
  FolderTree,
  X,
  Check,
  Search,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  totalProducts: number;
  icon: React.ElementType;
  description: string;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Premium Doi",
    nameBn: "প্রিমিয়াম দই",
    slug: "premium-doi",
    totalProducts: 12,
    icon: Sparkles,
    description: "বগুড়ার ঐতিহ্যবাহী সরা ও মাটির হাঁড়ির মিষ্টি এবং টক দই",
  },
  {
    id: "cat-2",
    name: "Laddu",
    nameBn: "ঐতিহ্যবাহী লাড্ডু",
    slug: "laddu",
    totalProducts: 8,
    icon: Cookie,
    description: "খাঁটি ঘিয়ে ভাজা মতিচুর ও বেসনের স্পেশাল লাড্ডু",
  },
  {
    id: "cat-3",
    name: "Pure Ghee",
    nameBn: "খাঁটি গাওয়া ঘি",
    slug: "pure-ghee",
    totalProducts: 5,
    icon: Flame,
    description: "ঘরোয়া প্রক্রিয়ায় প্রস্তুতকৃত দানাদার সুগন্ধি গাওয়া ঘি",
  },
  {
    id: "cat-4",
    name: "Laccha Semai",
    nameBn: "প্রিমিয়াম লাচ্ছা সেমাই",
    slug: "laccha-semai",
    totalProducts: 6,
    icon: Wheat,
    description: "ঘিয়ে ভাজা মচমচে প্রিমিয়াম কোয়ালিটির লাচ্ছা সেমাই",
  },
  {
    id: "cat-5",
    name: "Traditional Sweets",
    nameBn: "ঐতিহ্যবাহী মিষ্টি",
    slug: "traditional-sweets",
    totalProducts: 14,
    icon: Cake,
    description: "রসগোল্লা, চমচম, কালোজাম এবং ছানার মিষ্টির সম্ভার",
  },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form state
  const [formNameBn, setFormNameBn] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formProducts, setFormProducts] = useState(0);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.nameBn.includes(searchQuery) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingCategory(null);
    setFormNameBn("");
    setFormNameEn("");
    setFormSlug("");
    setFormProducts(0);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormNameBn(cat.nameBn);
    setFormNameEn(cat.name);
    setFormSlug(cat.slug);
    setFormProducts(cat.totalProducts);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`আপনি কি "${name}" ক্যাটাগরিটি মুছে ফেলতে চান?`)) {
      setCategories((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameBn.trim() || !formSlug.trim()) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === editingCategory.id
            ? {
                ...item,
                name: formNameEn || item.name,
                nameBn: formNameBn,
                slug: formSlug,
                totalProducts: formProducts,
              }
            : item
        )
      );
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: formNameEn || formNameBn,
        nameBn: formNameBn,
        slug: formSlug.toLowerCase().replace(/\s+/g, "-"),
        totalProducts: formProducts || 0,
        icon: FolderTree,
        description: "নতুন ক্যাটাগরি বিবরণ",
      };
      setCategories((prev) => [...prev, newCat]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 font-bengali space-y-6">
      {/* ── 1. Header & Action ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="font-bengali text-3xl font-bold text-gray-800 tracking-tight">
            ক্যাটাগরি
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            দই বিলাসের পণ্য ক্যাটাগরি তালিকা, প্রোডাক্ট সংখ্যা ও পরিচালনা
          </p>
        </div>

        {/* Right: + নতুন ক্যাটাগরি Button */}
        <button
          type="button"
          onClick={openAddModal}
          className="bg-doibrand-dark text-white hover:bg-doibrand-gold px-5 py-2.5 rounded-xl transition-colors font-semibold flex items-center gap-2 shadow-sm cursor-pointer self-start sm:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন ক্যাটাগরি</span>
        </button>
      </div>

      {/* Search and summary bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ক্যাটাগরি খুঁজুন..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-doibrand-gold shadow-2xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <span className="text-xs text-gray-500 self-start sm:self-auto">
          সর্বমোট ক্যাটাগরি: <strong className="text-doibrand-dark">{categories.length}</strong> টি
        </span>
      </div>

      {/* ── 2. Categories Table for Desktop (Hidden on Mobile) ─────────── */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            {/* Table Header */}
            <thead className="bg-gray-50 text-gray-500 font-medium text-sm py-4 px-6 text-left border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 text-left">Icon/Image</th>
                <th className="py-4 px-6 text-left">Category Name</th>
                <th className="py-4 px-6 text-left">Slug</th>
                <th className="py-4 px-6 text-left">Total Products</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filteredCategories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <tr
                    key={cat.id}
                    className="hover:bg-stone-50/70 transition-colors group"
                  >
                    {/* Icon Column */}
                    <td className="py-4 px-6">
                      <div className="w-10 h-10 bg-doibrand-light rounded-full flex items-center justify-center text-doibrand-gold shrink-0 border border-amber-100/50 shadow-2xs">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </td>

                    {/* Category Name Column */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-doibrand-dark text-base">
                        {cat.nameBn}
                      </div>
                      <div className="text-xs text-gray-400 font-sans">
                        {cat.name}
                      </div>
                    </td>

                    {/* Slug Column */}
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs text-gray-600 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                        /{cat.slug}
                      </span>
                    </td>

                    {/* Total Products Column */}
                    <td className="py-4 px-6">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold font-sans">
                        {cat.totalProducts} items
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          title="সম্পাদনা করুন"
                          className="p-2 rounded-lg text-gray-500 hover:text-doibrand-gold hover:bg-amber-50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id, cat.nameBn)}
                          title="মুছে ফেলুন"
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 3. Mobile View: CSS Grid of Cards (block md:hidden) ────────── */}
      <div className="block md:hidden grid grid-cols-1 gap-4 mt-6">
        {filteredCategories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-doibrand-light rounded-full flex items-center justify-center text-doibrand-gold shrink-0 border border-amber-100/50">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-doibrand-dark">
                      {cat.nameBn}
                    </h3>
                    <p className="text-xs text-gray-400 font-sans">{cat.name}</p>
                  </div>
                </div>

                {/* Total Products Number Badge */}
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold font-sans">
                  {cat.totalProducts} items
                </span>
              </div>

              {/* Slug */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs">
                <span className="text-gray-400">URL Slug:</span>
                <span className="font-mono text-gray-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  /{cat.slug}
                </span>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:text-doibrand-gold hover:border-doibrand-gold transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>এডিট</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.nameBn)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 bg-red-50 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ডিলিট</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal: Add / Edit Category ─────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-doibrand-dark">
                {editingCategory ? "ক্যাটাগরি সম্পাদনা করুন" : "নতুন ক্যাটাগরি যোগ করুন"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  ক্যাটাগরির নাম (বাংলা) *
                </label>
                <input
                  type="text"
                  required
                  value={formNameBn}
                  onChange={(e) => setFormNameBn(e.target.value)}
                  placeholder="যেমন: প্রিমিয়াম দই"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold font-bengali"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Category Name (English)
                </label>
                <input
                  type="text"
                  value={formNameEn}
                  onChange={(e) => setFormNameEn(e.target.value)}
                  placeholder="e.g. Premium Doi"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. premium-doi"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  বর্তমান পণ্যের সংখ্যা
                </label>
                <input
                  type="number"
                  min="0"
                  value={formProducts}
                  onChange={(e) => setFormProducts(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm font-sans focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold"
                />
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
                  {editingCategory ? "আপডেট করুন" : "যোগ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
