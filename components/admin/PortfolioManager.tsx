"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PortfolioItem } from '@/lib/content-types';

type PortfolioManagerProps = {
  title: string;
  description: string;
  forceCategory?: string;
  showFilters?: boolean;
};

const EMPTY: Partial<PortfolioItem> = { title: '', image: '', category: '', description: '' };
const CATEGORY_OPTIONS = ['Cinematic', 'Gaming', 'Tech', 'Lifestyle', 'Drama', 'Action', 'Horror', 'Custom'];
const FILTER_OPTIONS = ['All', 'Cinematic', 'Gaming', 'Tech', 'Lifestyle', 'Drama', 'Action', 'Horror'];

export function PortfolioManager({
  title,
  description,
  forceCategory,
  showFilters = true,
}: PortfolioManagerProps) {
  const hasPendingNewAction =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('action') === 'new';
  const initialFormState = forceCategory ? { ...EMPTY, category: forceCategory } : EMPTY;
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(hasPendingNewAction);
  const [form, setForm] = useState<Partial<PortfolioItem>>(initialFormState);
  const [editing, setEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(() => forceCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchItems = async (showSpinner = true) => {
    if (showSpinner) {
      setLoading(true);
    }
    const res = await fetch('/api/portfolio');
    const json = await res.json();
    setItems(json.data || []);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      const res = await fetch('/api/portfolio');
      const json = await res.json();

      if (!isMounted) {
        return;
      }

      setItems(json.data || []);
      setLoading(false);
    };

    void loadItems();

    if (hasPendingNewAction && typeof window !== 'undefined') {
      const newUrl = window.location.pathname + (window.location.hash || '');
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }

    return () => {
      isMounted = false;
    };
  }, [hasPendingNewAction]);

  const filteredItems = useMemo(() => {
    const source = forceCategory
      ? items.filter((item) => item.category?.toLowerCase() === forceCategory.toLowerCase())
      : items;

    const byFilter =
      !showFilters || activeFilter === 'All'
        ? source
        : source.filter((item) => item.category?.toLowerCase() === activeFilter.toLowerCase());

    if (!searchQuery.trim()) return byFilter;
    const q = searchQuery.toLowerCase();
    return byFilter.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }, [activeFilter, forceCategory, items, showFilters, searchQuery]);

  const openCreate = () => {
    setForm(forceCategory ? { ...EMPTY, category: forceCategory } : EMPTY);
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setForm(forceCategory ? { ...item, category: forceCategory } : item);
    setEditing(item._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(forceCategory ? { ...EMPTY, category: forceCategory } : EMPTY);
    setEditing(null);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const category = forceCategory || form.category || 'portfolio';
    fd.append('folder', category.toLowerCase().replace(/[^a-z0-9_-]/g, '-') || 'portfolio');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) {
      setForm((prev) => ({ ...prev, image: data.url, category: forceCategory || prev.category }));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title?.trim()) {
      showToast('Please enter a title.', 'error');
      return;
    }
    setSaving(true);
    const url = editing ? `/api/portfolio/${editing}` : '/api/portfolio';
    const method = editing ? 'PUT' : 'POST';
    const payload = forceCategory ? { ...form, category: forceCategory } : form;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      showToast(editing ? 'Item updated!' : 'Item created!');
    } else {
      showToast('Something went wrong.', 'error');
    }
    await fetchItems(false);
    closeModal();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    showToast('Item deleted.');
    await fetchItems(false);
  };

  const displayCount = forceCategory
    ? items.filter((i) => i.category?.toLowerCase() === forceCategory.toLowerCase()).length
    : items.length;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium border ${
              toast.type === 'error'
                ? 'bg-red-500/20 border-red-500/30 text-red-300'
                : 'bg-green-500/20 border-green-500/30 text-green-300'
            }`}
          >
            <i className={toast.type === 'error' ? 'ri-error-warning-line' : 'ri-checkbox-circle-line'} />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black">{title}</h1>
            {!loading && (
              <span className="text-sm text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full font-mono">
                {displayCount} item{displayCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-gray-400 font-light">{description}</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-100 active:scale-95 transition-all flex items-center gap-2 text-sm shadow-lg shadow-white/10"
        >
          <i className="ri-add-line text-base" />
          Add Thumbnail
        </button>
      </header>

      {/* Filters + Search */}
      {showFilters && (
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-white text-black shadow-md'
                    : 'glass text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="relative max-w-sm">
            <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, category…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30 placeholder:text-white/25 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                <i className="ri-close-line" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-video rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-5">
            <i className="ri-image-2-line text-4xl text-white/20" />
          </div>
          <p className="text-white/40 font-medium mb-2">
            {searchQuery ? 'No results found' : 'No items yet'}
          </p>
          <p className="text-sm text-white/20 mb-6">
            {searchQuery
              ? `Nothing matches "${searchQuery}"`
              : 'Upload your first thumbnail to get started.'}
          </p>
          {!searchQuery && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
              <i className="ri-add-line" /> Add First Item
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.03 }}
                className="group relative glass-card rounded-2xl overflow-hidden border border-white/8 hover:border-white/20 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-white/5 relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/15">
                      <i className="ri-image-line text-3xl" />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-xs font-bold hover:bg-white hover:text-black transition-all"
                      >
                        <i className="ri-edit-line" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(item._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <i className="ri-delete-bin-line" /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-bold text-sm truncate text-white/90">
                    {item.title || 'Untitled'}
                  </h3>
                  {item.category && (
                    <span className="inline-block text-[10px] text-white/35 uppercase tracking-wider font-mono mt-1 bg-white/5 px-1.5 py-0.5 rounded">
                      {item.category}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={closeModal}
          >
            <div className="min-h-full flex items-start justify-center p-4 py-8 md:py-12">
              <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                transition={{ type: 'spring', damping: 26, stiffness: 240 }}
                className="w-full max-w-lg glass-card rounded-3xl p-7 space-y-5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black">
                    {editing ? 'Edit Item' : 'New Portfolio Item'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    <i className="ri-close-line" />
                  </button>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium uppercase tracking-wider">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.title || ''}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 focus:bg-white/8 transition-all placeholder:text-white/25"
                    placeholder="e.g. Venom Thumbnail"
                    autoFocus
                  />
                </div>

                {/* Category */}
                {forceCategory ? (
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block font-medium uppercase tracking-wider">
                      Category
                    </label>
                    <div className="w-full rounded-xl bg-white text-black px-4 py-3 font-bold text-sm flex items-center gap-2">
                      <i className="ri-price-tag-3-line" /> {forceCategory}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block font-medium uppercase tracking-wider">
                      Category
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {CATEGORY_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setForm((f) => ({ ...f, category: option === 'Custom' ? '' : option }))
                          }
                          className={`rounded-xl px-2 py-2.5 text-xs font-medium transition-all ${
                            option === 'Custom'
                              ? !form.category || !CATEGORY_OPTIONS.slice(0, -1).includes(form.category || '')
                                ? 'bg-white text-black'
                                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                              : form.category === option
                              ? 'bg-white text-black'
                              : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <input
                      value={form.category || ''}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 text-sm placeholder:text-white/25 transition-all"
                      placeholder="Or type a custom category…"
                    />
                  </div>
                )}

                {/* Image */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium uppercase tracking-wider">
                    Image
                  </label>
                  <div className="space-y-3">
                    {form.image && (
                      <div className="relative group/img">
                        <img
                          src={form.image}
                          alt="Preview"
                          className="w-full aspect-video object-cover rounded-xl border border-white/10"
                        />
                        <button
                          onClick={() => setForm((f) => ({ ...f, image: '' }))}
                          className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center text-white/60 hover:text-white opacity-0 group-hover/img:opacity-100 transition-all"
                        >
                          <i className="ri-close-line text-sm" />
                        </button>
                      </div>
                    )}
                    <label
                      className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-dashed transition-all text-sm font-medium cursor-pointer ${
                        uploading
                          ? 'border-white/10 opacity-50 cursor-not-allowed'
                          : 'border-white/20 hover:border-white/40 hover:bg-white/3'
                      }`}
                    >
                      {uploading ? (
                        <>
                          <i className="ri-loader-4-line animate-spin" /> Uploading…
                        </>
                      ) : (
                        <>
                          <i className="ri-upload-cloud-2-line text-lg" /> Upload Image
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={uploading}
                      />
                    </label>
                    <p className="text-center text-[11px] text-white/25">or paste a URL below</p>
                    <input
                      value={form.image || ''}
                      onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30 placeholder:text-white/25 transition-all"
                      placeholder="https://…"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium uppercase tracking-wider">
                    Description <span className="text-white/25">(optional)</span>
                  </label>
                  <textarea
                    value={form.description || ''}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 resize-none placeholder:text-white/25 text-sm transition-all"
                    placeholder="Short description…"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-100 active:scale-95 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <i className="ri-loader-4-line animate-spin" />
                        Saving…
                      </>
                    ) : editing ? (
                      'Save Changes'
                    ) : (
                      'Create Item'
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.88 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.88 }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              className="glass-card rounded-3xl p-8 max-w-sm w-full text-center space-y-5 border border-red-500/10"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-3xl mx-auto">
                <i className="ri-delete-bin-2-line" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Delete this item?</h3>
                <p className="text-gray-500 text-sm font-light">
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 active:scale-95 transition-all text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
