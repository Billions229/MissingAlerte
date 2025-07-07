import { useEffect } from 'react';
import { router } from 'expo-router';

export default function IndexScreen() {
  useEffect(() => {
    // Redirect to welcome screen on app start
    router.replace('/welcome');
  }, []);

  return null;
}
