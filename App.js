import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeRoot from './components/home';
import ShopsRoot from './components/shops';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function test() {
  return (
    <Text>test</Text>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeRoot} />
        <Drawer.Screen name="Shops" component={ShopsRoot} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
