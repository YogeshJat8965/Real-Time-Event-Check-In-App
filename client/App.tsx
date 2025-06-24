import React from "react";
import { ApolloProvider } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { client } from "./src/lib/apollo";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import EventListScreen from "./src/screens/EventListScreen";
import EventDetailScreen from "./src/screens/EventDetailScreen";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import Toast from "react-native-toast-message";
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
    <ApolloProvider client={client}>
      <ErrorBoundary>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="EventList" component={EventListScreen} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </ErrorBoundary>
    </ApolloProvider>
    </PaperProvider>
  );
}
