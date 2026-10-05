// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.tsx to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";

import {
  SafeAreaProvider
} from "react-native-safe-area-context";

import {
  AuthProvider
} from "./src/context/AuthContext";

import AppNavigator
  from "./src/navigation/AppNavigator";

const queryClient =
  new QueryClient();

export default function App() {

  return (

    <QueryClientProvider
      client={queryClient}
    >

      <AuthProvider>

        <SafeAreaProvider>

          <AppNavigator />

        </SafeAreaProvider>

      </AuthProvider>

    </QueryClientProvider>

  );
}