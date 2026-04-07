'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DEFAULT_CATEGORIES, getIconByName } from '@/data/categories';

type ApiCategory = {
  _id?: string;
  name: string;
  slug: string;
  iconName?: string;
  color?: string;
  bgGradient?: string;
  count?: number;
  description?: string;
};

export default function CategoriesPage() {
  const [approvedCategories, setApprovedCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_URL;
      if (!apiBase) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiBase}/api/categories`);
        const payload = await response.json();
        if (response.ok && payload?.success && Array.isArray(payload.data)) {
          setApprovedCategories(payload.data);
        }
      } catch {
        // keep default categories only
      } finally {
        setLoading(false);
      }
    };

    void loadCategories();
  }, []);

  const visibleCategories = useMemo(() => {
    const defaultSlugs = new Set(DEFAULT_CATEGORIES.map((category) => category.slug));
    const customCategories = approvedCategories.filter((category) => !defaultSlugs.has(category.slug));

    return [
      ...DEFAULT_CATEGORIES,
      ...customCategories.map((category) => ({
        name: category.name,
        slug: category.slug,
        iconName: category.iconName || 'ShieldCheck',
        color: category.color || 'bg-slate-100 text-slate-600',
        count: typeof category.count === 'number' ? category.count : 0,
      })),
    ];
  }, [approvedCategories]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#2286BE]/10 text-[#2286BE] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest"
          >
            Explore Marketplace
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black text-slate-900 tracking-tight mt-4"
          >
            Browse Categories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-xl mt-6 font-medium max-w-2xl mx-auto"
          >
            Find the perfect professional for every house task from our wide range of service categories.
          </motion.p>
          {loading ? (
            <p className="mt-4 text-sm font-semibold text-slate-400">Loading approved custom categories...</p>
          ) : null}
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {visibleCategories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center hover:shadow-2xl hover:shadow-[#2286BE]/10 hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`h-20 w-20 ${cat.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {getIconByName(cat.iconName, { size: 40 })}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                  {cat.count} Services
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-6">Need a custom service?</h2>
            <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto mb-10">
              If you can&apos;t find what you&apos;re looking for, post a custom request and we&apos;ll find the best provider for you.
            </p>
            <Link
              href="/post-request"
              className="inline-flex items-center justify-center px-10 h-16 bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-[#2286BE]/20 hover:scale-105"
            >
              Post a Request
            </Link>
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2286BE]/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-[80px] pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}
