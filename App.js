// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';  
import WorkoutScreen from './src/screens/WorkoutScreen';  

const Stack = createNativeStackNavigator();

export default function Main() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome' }} />
          <Stack.Screen name="Workout" component={WorkoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

