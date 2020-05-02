import React, { useState } from 'react';
import { Button, View, Text, TextInput, StyleSheet, Platform, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext, UserContext } from './contexts.js';
import { Formik } from 'formik';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function ViewOrder({ route, navigation }) {
  const { auth, order } = route.params;

  return (
    <View><Text>Item ID: {order.itemId}</Text></View>
  )
}
function OrdersHome({ route, navigation }) {
  const { auth } = route.params;
  const [state, dispatch] = React.useReducer((prevState, action) => {
    switch (action.type) {
      case 'LOADED_ORDERS':
        return {
          ...prevState,
          loading: false,
          orders: action.orders,
        };
      default:
        return {
          // error 
        }
    }
  },
    { loading: true, orders: [] });
  const getOrders = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("token", auth.userToken);
    myHeaders.append("username", auth.userUsername);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      body: null,
      redirect: 'follow'
    };

    fetch("http://13.77.96.221:4000/shop/orders", requestOptions)
      .then(response => response.text())
      .then(result => {
        result = JSON.parse(result);
        console.log(result);
        dispatch({ type: 'LOADED_ORDERS', orders: result })
      })
      .catch(error => {
        console.log(error);
      });
  }
  React.useEffect(() => {
    getOrders();
  }, []);
  return (
    <View>
      {state.loading ? <Text>loading</Text> :
        state.orders.map(order => {
          return (
            <TouchableOpacity onPress={() => navigation.navigate('ViewOrder', { order })} key={order._id} style={{ borderBottomWidth: 2, borderBottomColor: 'black' }}>
              <Text>order id: {order._id}</Text>
              <Text>status: {order.status}</Text>
            </TouchableOpacity>
          );
        })}
    </View>
  )
}

export default function OrdersRoot({ navigation }) {
  function handleMenuButtonPress() {
    navigation.toggleDrawer();
  }
  return (
    <UserContext.Consumer>
      {value => {
        return (
          <Stack.Navigator>
            <Stack.Screen
              name="Shops" initialParams={{ auth: value }} options={{
                headerLeft: () => (
                  <Button
                    title="Menu" onPress={handleMenuButtonPress}
                  />
                )
              }}
              component={OrdersHome}
            />
            <Stack.Screen name="ViewOrder" initialParams={{ auth: value }} component={ViewOrder} />
          </Stack.Navigator>
        )
      }}
    </UserContext.Consumer>
  );
}
