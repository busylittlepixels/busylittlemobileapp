/**
 * This script helps migrate React Navigation screens to Expo Router format.
 * 
 * Usage:
 * node scripts/migrate-to-expo-router.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path configurations
const APP_DIR = path.resolve(__dirname, '../app');
const SCREENS_DIR = path.resolve(APP_DIR, 'screens');

console.log('Starting migration to Expo Router...');

// 1. Ensure the necessary directories exist
console.log('Ensuring necessary directories exist...');
if (!fs.existsSync(path.resolve(APP_DIR, 'screens'))) {
  console.error('Error: screens directory not found!');
  process.exit(1);
}

// 2. Check if we already have a migration in progress
if (fs.existsSync(path.resolve(APP_DIR, '+layout.js'))) {
  console.log('Found existing +layout.js, migration might be in progress');
}

// 3. Provide instructions
console.log(`
Migration steps:
1. ✅ Simplified app/index.tsx to avoid duplicate navigation
2. ✅ Updated app/_layout.tsx to include all providers
3. ✅ Created app/+layout.js for root navigation
4. ✅ Created app/screens/+layout.js for screen navigation
5. 🚧 Next steps:
   - Create router.js files for each screen folder
   - Convert individual screens to use Expo Router

Manual migration of screens is required. For each screen:
1. Rename ScreenName.tsx to [id].tsx or index.tsx depending on the route pattern
2. Update imports to use expo-router instead of react-navigation
3. Replace navigation.navigate() with router.push() or router.replace()
4. Update params handling to use useLocalSearchParams()

Example of screen conversion:
- Before: import { useNavigation } from '@react-navigation/native';
- After:  import { useRouter, useLocalSearchParams } from 'expo-router';

- Before: const navigation = useNavigation();
- After:  const router = useRouter();

- Before: navigation.navigate('ScreenName', { id: 123 });
- After:  router.push({ pathname: '/screens/ScreenName/[id]', params: { id: 123 } });

Run the app to test each screen after migration.
`);

console.log('Migration script complete. Follow the instructions above to complete the migration.'); 