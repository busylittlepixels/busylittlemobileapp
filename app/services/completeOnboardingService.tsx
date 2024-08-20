import { supabase } from '../../supabase';


const complete = async (user: any, cities: string[]) => {
    // console.log('onboarding service, complete method');
    // console.log('as far as the service (user object)', user); // Ensure this is the entire user object
    // console.log('as far as the service (selected cities)', cities);

    try {
        if (!user) {  // Ensure you're checking for a valid user object
            throw new Error('User not found or invalid');
        }
        

        // console.log('before supabase - profile update', user)
        // Update the 'cities' field in the user's profile
        const { data, error } = await supabase
            .from('profiles')
            .update({ cities })
            .eq('id', user); // Use user.id to match the correct user profile

        if (error) {
            throw new Error('Failed to update profile: ' + error.message);
        }

        // Merge the updated fields into the existing user object
        const updatedUser = { ...user, cities };

        // 
        // console.log('updatedUser in service', updatedUser);
        return updatedUser;

    } catch (error) {
        // console.error('Error in completeOnboarding:', error);
        return null;
    }
};


export { complete };