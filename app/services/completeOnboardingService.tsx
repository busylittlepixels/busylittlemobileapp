// services/completeOnboardingService.ts
import { supabase } from '../../supabase';

export const complete = async (user: { id: string }, cities: string[]) => {
    try {
        if (!user || !user.id) {
            throw new Error('User not found or invalid');
        }

        // Update the 'cities' field in the user's profile
        const { data, error } = await supabase
            .from('profiles')
            .update({ cities })
            .eq('id', user.id);

        if (error) {
            throw new Error('Failed to update profile: ' + error.message);
        }

        const updatedUser = { ...user, cities };
        return updatedUser;
    } catch (error) {
        console.error('Error in completeOnboarding:', error);
        return null;
    }
};
