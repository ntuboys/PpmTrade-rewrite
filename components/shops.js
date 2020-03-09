import * as React from 'react';
import { Button, View, Text, StyleSheet, Platform, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const shopData = [ // dummy data
  {
    id: 0,
    name: 'shop 1 name',
    address: 'shop 1 location',
    ownerId: 'arandomstringofletters',
    inventory: [
      {
        itemId: 1,
        itemName: 'item 1 name',
        itemDesc: 'item 1 desc',
        itemPrice: 1.1,
        itemQnt: 1,
      },
      {
        itemId: 2,
        itemName: 'item 2 name',
        itemDesc: 'item 2 desc',
        itemPrice: 2.2,
        itemQnt: 2,
      },
    ],
  },
  {
    id: 1,
    name: 'shop 2 name',
    address: 'shop 2 location',
    ownerId: 'arandomstringofletters',
    inventory: [
      {
        itemId: 1,
        itemName: 'item 1 name',
        itemDesc: 'item 1 desc',
        itemPrice: 1.1,
        itemQnt: 1,
      },
      {
        itemId: 2,
        itemName: 'item 2 name',
        itemDesc: 'item 2 desc',
        itemPrice: 2.2,
        itemQnt: 2,
      },
    ],
  },
];

function OpenShop({ route, navigation }) {
  const { shopId } = route.params;
  let shop;
  for (const s in shopData) {
    if (shopData[s].id == shopId) {
      shop = shopData[s];
    }
  }

  if (shop) {
    navigation.setOptions({ title: shop.name });
  } else {
    // show error
    navigation.goBack();
  }
  return (
    <View style={{ padding: 10 }}>
      <Text>{shopId}</Text>
    </View>
  );
}

function ShopsHome({ navigation }) {
  return (
    <View style={{ paddingHorizontal: 10 }}>
      {shopData.map((shop, i) => (
        <TouchableOpacity
          underlayColor="white" onPress={() => navigation.navigate('Shop', { shopId: shop.id })} key={shop.id}
          style={(i === shopData.length - 1 ? { paddingVertical: 20 } : { paddingVertical: 20, borderBottomWidth: 2, borderBottomColor: 'lightgray' })}
        >
          <View>
            <Text style={{ textAlign: 'center', fontSize: 30 }}>{shop.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ShopsRoot({ navigation }) {
  function handleMenuButtonPress() {
    navigation.toggleDrawer();
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Shops" options={{
          headerLeft: () => (
            <Button
              title="Menu" onPress={handleMenuButtonPress}
            />
          ),
        }}
        component={ShopsHome}
      />
      <Stack.Screen name="Shop" component={OpenShop} />
    </Stack.Navigator>
  );
}
