// src/utils/cache.js

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 menit

/**
 * Mendapatkan data dari cache
 * @param {string} key
 * @returns {any|null}
 */
export const getFromCache = (key) => {
  const cached = cache.get(key);
  if (!cached) {
    return null;
  }

  const isExpired = new Date().getTime() - cached.timestamp > CACHE_TTL;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return cached.data;
};

/**
 * Menyimpan data ke cache
 * @param {string} key
 * @param {any} data
 */
export const setInCache = (key, data) => {
  const timestamp = new Date().getTime();
  cache.set(key, { data, timestamp });
};

/**
 * Menghapus cache berdasarkan kunci
 * @param {string} key
 */
export const invalidateCache = (key) => {
  cache.delete(key);
};

/**
 * Menghapus semua cache (misalnya setelah create/update/delete)
 */
export const clearAllCache = () => {
  cache.clear();
};
