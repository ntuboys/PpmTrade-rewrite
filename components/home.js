import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeScreen() {
  return (
    <Text>hello</Text>
  );
}
export default function HomeRoot() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
