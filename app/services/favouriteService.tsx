import { supabase } from '../../supabase';

const addFavorite = async (userId: any, articleId: any, title: any, slug:any, content: any) => {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .insert([
                { user_id: userId, article_id: articleId, title: title, article_slug: slug, content: content },
            ])
            .select();  // Explicitly request the inserted data to be returned
        
        if (error) {
            // Handle the unique constraint violation
            console.log('Favorite already exists.', error);
            return { message: 'Favorite already exists', data: null };
        }

        if (error) {
            console.error('Error adding favorite:', error);
            return { error };
        } else {
            // console.log('Favorite added:', data);
            return { data };
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return { error };
    }
};

const removeFavorite = async (userId: any, articleId: any) => {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('article_id', articleId);

        if (error) {
            console.error('Error removing favorite:', error);
            return { error };
        } else {
            console.log('Favorite removed:', data);
            return { data };
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return { error };
    }
};

const getFavorites = async (userId: any) => {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .select('article_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching favorites:', error);
            return { error };
        } else {
            return { data };
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return { error };
    }
};

const toggleFavorite = async (userId: any, articleId: any, title: any, slug: any, content: any) => {
    try {
        // console.log('inside toggle fave method (userid)', userId);
        // console.log('inside toggle fave method (articleid)', articleId);

        const { data, error } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('article_id', articleId)
            .single();

        if (data) {
            // Article is already favorited, remove it
            // console.log('already here, removing');
            return await removeFavorite(userId, articleId);
        } else {
            // Article is not favorited, add it
            // console.log('not already here, adding');
            return await addFavorite(userId, articleId, title, slug, content);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return { error };
    }
};

export { addFavorite, removeFavorite, getFavorites, toggleFavorite };
