import { supabase } from '../../supabase';

// Function to generate a slug from the title

const generateSlug = (title: { toString: () => string; }) => {
    if (!title) return ''; // Fallback if title is undefined or null
    return title
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

const normalizeContent = (input: { rendered: any; }) => {
    if (input && typeof input === 'object' && input.rendered) {
        return input.rendered;
    }
    return input || ''; // Fallback to an empty string if input is undefined or null
};

const addFavorite = async (userId: any, articleId: any, title: { rendered: any; }, slug: string, content: { rendered: any; }, featuredMedia: string) => {
    console.log('add favorite userId', userId);
    try {
        // Normalize title and content
        const normalizedTitle = normalizeContent(title);
        const normalizedContent = normalizeContent(content);

        // Generate slug if it's not provided
        const finalSlug = slug || generateSlug(normalizedTitle);

        // Check if the favorite already exists to prevent duplication
        const { data: existingFavorite, error: fetchError } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('article_id', articleId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // Error code for no rows found
            console.error('Error checking for existing favorite:', fetchError);
            return { error: fetchError };
        }

        if (existingFavorite) {
            return { message: 'Favorite already exists', data: existingFavorite };
        }

        // Insert new favorite with the featured image
        const { data, error } = await supabase
            .from('favorites')
            .insert([
                {
                    user_id: userId,
                    article_id: articleId,
                    title: normalizedTitle,
                    article_slug: finalSlug,
                    content: normalizedContent,
                    featured_media: featuredMedia  // Store the featured image
                },
            ])
            .select();  // Explicitly request the inserted data to be returned

        if (error) {
            console.error('Error adding favorite:', error);
            return { error };
        }

        return { data };
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
            .select('*')
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

const toggleFavorite = async (userId: any, articleId: any, title: any, slug: any, content: any, featuredMedia: any) => {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('article_id', articleId)
            .single();

        if (data) {
            return await removeFavorite(userId, articleId);
        } else {
            return await addFavorite(userId, articleId, title, slug, content, featuredMedia);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return { error };
    }
};

const resetFavorites = async (userId: any) => {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Error resetting favorites:', error);
            return { error };
        }

        return { data };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { error };
    }
};


export { addFavorite, removeFavorite, getFavorites, toggleFavorite, resetFavorites };
