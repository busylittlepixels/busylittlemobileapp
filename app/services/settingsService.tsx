import { supabase } from '../../supabase';

const enablePublicProfile = async ({ userId }: any) => {
    // console.log('INSIDE SERVICE METHOD', userId);

    try {
        // Fetch the user's profile and check the enablepublicprofile field
        const { data, error } = await supabase
            .from('profiles')
            .select('enablepublicprofile')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return { error };
        }

        if (data) {
            // If enablepublicprofile is true, toggle it to false, otherwise set it to true
            const newPublicStatus = !data.enablepublicprofile;

            // Update the enablepublicprofile field to the toggled value
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ enablepublicprofile: newPublicStatus })
                .eq('user_id', userId);

            if (updateError) {
                console.error('Error updating profile:', updateError);
                return { error: updateError };
            }

            console.log(`Public profile ${newPublicStatus ? 'enabled' : 'disabled'}.`);
            return { message: `Profile ${newPublicStatus ? 'enabled' : 'disabled'} successfully.` };
        }

    } catch (error) {
        console.error('Unexpected error:', error);
        return { error };
    }
};

export { enablePublicProfile };
