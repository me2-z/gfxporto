"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider';
import type { TransformationItem } from '@/lib/content-types';

const EMPTY: Partial<TransformationItem> = { title: '', description: '', beforeImage: '', afterImage: '' };

export default function AdminTransformations() {
  const hasPendingNewAction =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('action') === 'new';
  const [items, setItems] = useState<TransformationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(hasPendingNewAction);
  const [form, setForm] = useState<Partial<TransformationItem>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<'beforeImage' | 'afterImage' | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchItems = async (showSpinner = true) => {
    if (showSpinner) {
      setLoading(true);
    }
    const res = await fetch('/api/transformations');
    const json = await res.json();
    setItems(json.data || []);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      const res = await fetch('/api/transformations');
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

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowModal(true); };
  const openEdit = (item: TransformationItem) => { setForm(item); setEditing(item._id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setForm(EMPTY); setEditing(null); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'beforeImage' | 'afterImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(field);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'transformations');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setForm(f => ({ ...f, [field]: data.url }));
    setUploadingField(null);
  };

  const handleSave = async () => {
    if (!form.title?.trim()) { showToast('Please enter a title.', 'error'); return; }
    if (!form.beforeImage || !form.afterImage) {
      showToast('Please provide both Before and After images.', 'error');
      return;
    }
    setSaving(true);
    const url = editing ? `/api/transformations/${editing}` : '/api/transformations';
    const res = await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) showToast(editing ? 'Transformation updated!' : 'Transformation created!');
    else showToast('Something went wrong.', 'error');
    await fetchItems(false);
    closeModal();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/transformations/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    showToast('Transformation deleted.');
    void fetchItems(false);
  };

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
      <header className="mb-10 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black">Transformations</h1>
            {!loading && (
              <span className="text-sm text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full font-mono">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-gray-400 font-light">Manage before / after comparison sliders</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-100 active:scale-95 transition-all flex items-center gap-2 text-sm shadow-lg shadow-white/10"
        >
          <i className="ri-add-line text-base" />
          New Transformation
        </button>
      </header>

      {/* List */}
      {loading ? (
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="glass-card rounded-3xl p-6 animate-pulse">
              <div className="aspect-video rounded-2xl bg-white/5 max-w-3xl mb-4" />
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-5 bg-white/5 rounded w-48" />
                  <div className="h-3 bg-white/5 rounded w-72" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-20 bg-white/5 rounded-full" />
                  <div className="h-9 w-20 bg-white/5 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-5">
            <i className="ri-magic-line text-4xl text-white/20" />
          </div>
          <p className="text-white/40 font-medium mb-2">No transformations yet</p>
          <p className="text-sm text-white/20 mb-6">Add your first before / after pair to get started.</p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            <i className="ri-add-line" /> Add First Transformation
          </button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {items.map((item, idx) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="glass-card rounded-3xl p-6 border border-white/8 hover:border-white/15 transition-all"
            >
              <div className="grid md:grid-cols-2 gap-6 items-start">
                {/* Slider preview */}
                <div>
                  {item.beforeImage && item.afterImage ? (
                    <BeforeAfterSlider beforeImage={item.beforeImage} afterImage={item.afterImage} />
                  ) : (
                    <div className="aspect-video rounded-2xl bg-white/5 flex flex-col items-center justify-center text-white/20 gap-2">
                      <i className="ri-image-2-line text-4xl" />
                      <p className="text-xs">Images missing</p>
                    </div>
                  )}
                </div>

                {/* Info + actions */}
                <div className="flex flex-col justify-between h-full gap-4">
                  <div>
                    <h3 className="font-black text-xl mb-1">{item.title || 'Untitled'}</h3>
                    {item.description && (
                      <p className="text-gray-400 text-sm font-light leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Image thumbnails */}
                  <div className="grid grid-cols-2 gap-3">
                    {(['beforeImage', 'afterImage'] as const).map((field) => (
                      <div key={field}>
                        <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider mb-1.5">
                          {field === 'beforeImage' ? 'Before' : 'After'}
                        </p>
                        {item[field] ? (
                          <img
                            src={item[field]}
                            alt={field}
                            className="w-full aspect-video object-cover rounded-xl border border-white/10"
                          />
                        ) : (
                          <div className="w-full aspect-video rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                            <i className="ri-image-line" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="flex items-center gap-1.5 px-4 py-2 glass rounded-xl text-sm font-bold hover:bg-white hover:text-black transition-all"
                    >
                      <i className="ri-edit-line" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(item._id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <i className="ri-delete-bin-line" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="w-full max-w-lg glass-card rounded-3xl p-7 space-y-5 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black">
                  {editing ? 'Edit Transformation' : 'New Transformation'}
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
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 focus:bg-white/8 transition-all placeholder:text-white/25"
                  placeholder="e.g. Cinematic Color Upgrade"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium uppercase tracking-wider">
                  Description <span className="text-white/25">(optional)</span>
                </label>
                <textarea
                  value={form.description || ''}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 resize-none placeholder:text-white/25 text-sm transition-all"
                  placeholder="Describe the transformation…"
                />
              </div>

              {/* Image fields */}
              {(['beforeImage', 'afterImage'] as const).map((field) => (
                <div key={field}>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium uppercase tracking-wider">
                    {field === 'beforeImage' ? '📷 Before Image' : '✨ After Image'}{' '}
                    <span className="text-red-400">*</span>
                  </label>
                  {form[field] && (
                    <div className="relative group/img mb-2">
                      <img
                        src={form[field]}
                        alt={field}
                        className="w-full aspect-video object-cover rounded-xl border border-white/10"
                      />
                      <button
                        onClick={() => setForm(f => ({ ...f, [field]: '' }))}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center text-white/60 hover:text-white opacity-0 group-hover/img:opacity-100 transition-all"
                      >
                        <i className="ri-close-line text-sm" />
                      </button>
                    </div>
                  )}
                  <label
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed transition-all text-sm font-medium cursor-pointer ${
                      uploadingField === field
                        ? 'border-white/10 opacity-50 cursor-not-allowed'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/3'
                    }`}
                  >
                    {uploadingField === field ? (
                      <>
                        <i className="ri-loader-4-line animate-spin" /> Uploading…
                      </>
                    ) : (
                      <>
                        <i className="ri-upload-cloud-2-line" />
                        Upload {field === 'beforeImage' ? 'Before' : 'After'}
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload(e, field)}
                      disabled={uploadingField !== null}
                    />
                  </label>
                  <input
                    value={form[field] || ''}
                    onChange={(e) => setForm(f => ({ ...f, [field]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 text-sm mt-2 placeholder:text-white/25 transition-all"
                    placeholder="or paste URL…"
                  />
                </div>
              ))}

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
                      <i className="ri-loader-4-line animate-spin" /> Saving…
                    </>
                  ) : editing ? (
                    'Save Changes'
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
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
                <h3 className="text-xl font-bold mb-1">Delete transformation?</h3>
                <p className="text-gray-500 text-sm font-light">This action cannot be undone.</p>
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
