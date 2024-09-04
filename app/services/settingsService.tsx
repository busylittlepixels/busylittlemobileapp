
const enablePublicProfile = async ({userId}:any) => {
    console.log('enable public profile with userId', userId)
    try {
        return true;
    } catch (error) {
        console.error('Unexpected error:', error);
        return { error };
    }
};


export { enablePublicProfile };
