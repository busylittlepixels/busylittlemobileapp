import { useState, useEffect } from 'react';
import { toggleFavorite } from '../app/services/favouriteService'; // Adjust the path to your service

const useFavorite = (userId: unknown, articleId: unknown) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      setLoading(true);
      const { data, error } = await toggleFavorite(userId, articleId);

      if (error) {
        console.error('Error checking favorite status:', error);
      } else if (data) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
      setLoading(false);
    };

    checkFavoriteStatus();
  }, [userId, articleId]);

  const handleToggleFavorite = async () => {
    setLoading(true);
    const { data, error } = await toggleFavorite(userId, articleId);
    if (error) {
      console.error('Error toggling favorite:', error);
    } else {
      setIsFavorite(!isFavorite);
    }
    setLoading(false);
  };

  return { isFavorite, toggleFavorite: handleToggleFavorite, loading };
};

export default useFavorite;
