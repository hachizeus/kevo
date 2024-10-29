import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from './app/SignupScreen'; 
import LoginScreen from './app/LoginScreen';  
import Home from './app/Home';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer screenOptions={{ headerShown: false }} >
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login' }} 
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ title: 'Sign Up' }} 
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'Home' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
