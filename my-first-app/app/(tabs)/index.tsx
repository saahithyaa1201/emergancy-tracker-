import { Redirect } from 'expo-router';

export default function HomeScreen() {
  // Use Redirect component instead of programmatic navigation
  return <Redirect href="/(tabs)/screens/auth/SignIn" />;
}
