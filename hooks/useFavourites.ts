import { useState, useEffect } from 'react';
import { supabase } from './../supabase'; // If you still use supabase for managing favorites

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = supabase.auth.user();
      if (user) {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error(error);
        } else {
          setFavorites(data.map((fav) => fav.article_id));
        }
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (articleId) => {
    const user = supabase.auth.user();
    if (!user) return;

    const isFavorite = favorites.includes(articleId);
    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('article_id', articleId)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('favorites')
        .insert([{ article_id: articleId, user_id: user.id }]);
    }
    fetchFavorites(); // Refresh favorites
  };

  return { favorites, toggleFavorite };
};
