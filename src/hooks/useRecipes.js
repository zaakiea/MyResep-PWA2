// src/hooks/useRecipes.js
import { useState, useEffect, useCallback } from "react";
import recipeService from "../services/recipeService";
import { getFromCache, setInCache } from "../utils/cache";

/**
 * Custom hook for fetching recipes
 * @param {Object} params
 *
Query parameters
 * @returns {Object} { recipes,
loading, error,
pagination, refetch}
*/
export function useRecipes(params = {}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Buat cache key unik berdasarkan parameter
  const cacheKey = `recipes_${JSON.stringify(params)}`;

  const fetchRecipes = useCallback(async () => {
    // Cek cache dulu
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      setRecipes(cachedData.data || []);
      setPagination(cachedData.pagination || null);
      setLoading(false);
      return;
    }

    // Jika tidak ada di cache, fetch dari API
    try {
      setLoading(true);
      setError(null);
      const response = await recipeService.getRecipes(params);
      if (response.success) {
        setRecipes(response.data || []);
        setPagination(response.pagination || null);
        // Simpan ke cache
        setInCache(cacheKey, {
          data: response.data,
          pagination: response.pagination,
        });
      } else {
        setError(response.message || "Failed to fetch recipes");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [cacheKey]); // Dependency diubah ke cacheKey

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    pagination,
    refetch: fetchRecipes,
  };
}

/**
 *
Custom hook for fetching a single recipe
 * @param {string} id
Recipe ID
 * @returns {Object} { recipe, loading, error, refetch
}
*/
export function useRecipe(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cacheKey = `recipe_${id}`;

  const fetchRecipe = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Cek cache dulu
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      setRecipe(cachedData);
      setLoading(false);
      return;
    }

    // Jika tidak ada di cache, fetch dari API
    try {
      setLoading(true);
      setError(null);
      const response = await recipeService.getRecipeById(id);
      if (response.success) {
        setRecipe(response.data);
        // Simpan ke cache
        setInCache(cacheKey, response.data);
      } else {
        setError(response.message || "Failed to fetch recipe");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching recipe");
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }, [id, cacheKey]); // tambahkan cacheKey

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  return {
    recipe,
    loading,
    error,
    refetch: fetchRecipe,
  };
}
