import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext } from './contexts';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeScreen() {
  const { signOut } = React.useContext(AuthContext);
  return (
    <View>

      <Text>hello</Text>
      <Button title="signout" onPress={signOut} />
    </View>
  );
}
export default function HomeRoot({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home" component={HomeScreen} options={{
          headerLeft: () => (
            <Button
              title="Menu" onPress={() => navigation.toggleDrawer()}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
