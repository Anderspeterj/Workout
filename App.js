import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import HomeScreen from './HomeScreen'; // Ensure this path is correct
import WorkoutScreen from './WorkoutScreen'; // Ensure this path is correct
import WorkoutListScreen from './WorkoutListScreen';
import { enableScreens } from 'react-native-screens';

// Enable react-native-screens
enableScreens();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Workout"
            component={WorkoutScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="WorkoutList"
            component={WorkoutListScreen}
            options={{ title: 'Workout List' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  );
}















