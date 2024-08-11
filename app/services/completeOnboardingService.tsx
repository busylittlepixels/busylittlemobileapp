import { supabase } from '../../supabase';


const complete = async (user: any, cities: string[]) => {
    console.log('as far as the service');
    console.log('as far as the service (userid)', user.id);
    console.log('as far as the service (city/cities)', cities);
    console.log('current username', user.email)
    console.log('current user', user)

    try {
        if (!user ) {
            throw new Error('User not found or invalid');
        }
        // Update the 'cities' field in the user's profile
        const { data, error } = await supabase
            .from('profiles')
            .update({ cities }) // Correct way to update a field
            .eq('id', user.id);

        if (error) {
            throw new Error('Failed to update profile: ' + error.message);
        } 



        // Merge the updated fields into the existing user object
        // @ts-ignore
        const updatedUser = { ...user, cities };

        // Return the updated user profile
        return updatedUser;

    } catch (error) {
        console.error('Error in completeOnboarding:', error);
        return null;
    }
};

export { complete };
