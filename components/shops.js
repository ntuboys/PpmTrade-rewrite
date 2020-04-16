import React, { useState } from 'react';
import { Button, View, Text, TextInput, StyleSheet, Platform, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext, UserContext } from './contexts.js';
import { Formik } from 'formik';


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
  const [isInvVisible, setInvVisibility] = useState(false);
  function toggleInvVis() {
    setInvVisibility(!isInvVisible);
  }
  const { shop, auth } = route.params;

  console.log('=========shop==============')
  console.log(shop);

  if (shop) {
    navigation.setOptions({ title: shop.name });
  } else {
    // show error
    navigation.goBack();
  }
  return (
    <View style={{ padding: 10 }}>
      <Text>ID: {shop._id}</Text>
      <Text>Name: {shop.name}</Text>
      <Text>Address: {shop.address}</Text>
      <Text>Owner: {shop.ownerId}</Text>
      <View>
        {isInvVisible ? (
          <View>
            {shop.stock.map((item, i) => (
              <Text key={i}>{item.name} x{item.qnt} (ID: {item._id}, Price: {item.price})</Text>
            ))}
            <Button title="Hide inventory" onPress={toggleInvVis} />
            <Button title="Add to inventory" onPress={() => {
              navigation.navigate('NewItem', { shop: shop, auth: auth })
            }} />
          </View>) : (
            <Button title="Show inventory" onPress={toggleInvVis} />
          )}
      </View>
    </View>
  );
}

function ShopList({ navigation, route }) {
  const { auth } = route.params;
  const [state, dispatch] = React.useReducer((prevState, action) => {
    switch (action.type) {
      case 'LOADED_SHOPS':
        return {
          ...prevState,
          loading: false,
          shops: action.shops,
        };
      default:
        return {
          // error 
        }
    }
  },
    { loading: true, shops: [] });
  const getShops = async () => {
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

    fetch("http://192.168.0.28:4000/shop/", requestOptions)
      .then(response => response.text())
      .then(result => {
        result = JSON.parse(result);
        dispatch({ type: 'LOADED_SHOPS', shops: result })
      })
      .catch(error => {
        console.log(error);
      });
  }
  React.useEffect(() => {
    getShops();
  }, []);
  return (
    <View>
      {state.loading ? <Text>loading</Text> :
        state.shops.map(shop => {
          return (
            <TouchableOpacity key={shop._id} onPress={() => navigation.navigate('Shop', {
              shop: shop, auth: auth
            })}>
              <View style={{
                borderBottomColor: 'black', borderBottomWidth: 1, padding: 15
              }}>
                <Text>Name: {shop.name}</Text>
                <Text>Address: {shop.address}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      <Button title="Refresh" onPress={() => getShops()} />
    </View>
  )
}

function NewShop() {
  const createShop = (values, user) => {
    console.log(values)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", user.userToken);
    myHeaders.append("username", user.userUsername);

    var urlencoded = new URLSearchParams();
    urlencoded.append("name", values.name);
    urlencoded.append("address", values.address);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(values),
      redirect: 'follow'
    };

    fetch("http://192.168.0.28:4000/shop/create", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };

  return (
    <View>
      <UserContext.Consumer>
        {user => (
          <Formik
            initialValues={{ name: null, address: null }}
            onSubmit={(values) => {
              createShop(values, user);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <Text>Shop Name</Text>
                  <TextInput
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    style={{ width: 200, backgroundColor: 'white' }}
                    placeholder="cool shop"
                  />
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text>Address</Text>
                  <TextInput
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    value={values.address}
                    style={{ width: 200, backgroundColor: 'white' }}
                    placeholder="address"
                  />
                </View>
                <Button onPress={handleSubmit} title="Submit" />
              </View>
            )}
          </Formik>
        )}
      </UserContext.Consumer>
    </View>
  )
}

function ShopsHome({ navigation }) {
  return (
    <UserContext.Consumer>
      {value => navigation.navigate('ShopList', { auth: value })
      }
    </UserContext.Consumer>
  );
}

function NewItem({ navigation, route }) {
  const { shop, auth } = route.params;
  console.log(shop);
  return (<Formik
    initialValues={{ name: null, price: null, qnt: null, description: null }}
    onSubmit={(values) => {
      console.log('trying to submit: ')
      console.log(values);

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", auth.userToken);
      myHeaders.append("username", auth.userUsername);
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(values),
        redirect: 'follow'
      };

      fetch(`http://192.168.0.28:4000/shop/${shop._id}/inventory/add`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }}
  >
    {({ handleChange, handleBlur, handleSubmit, values }) => (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Text>name</Text>
          <TextInput
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            style={{ width: 200, backgroundColor: 'white' }}
            placeholder="arek"
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text>price</Text>
          <TextInput
            onChangeText={handleChange('price')}
            onBlur={handleBlur('price')}
            value={values.price}
            style={{ width: 200, backgroundColor: 'white' }}
            placeholder="pass"
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text>qnt</Text>
          <TextInput
            onChangeText={handleChange('qnt')}
            onBlur={handleBlur('qnt')}
            value={values.qnt}
            style={{ width: 200, backgroundColor: 'white' }}
            placeholder="pass"
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text>desc</Text>
          <TextInput
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            value={values.description}
            style={{ width: 200, backgroundColor: 'white' }}
            placeholder="pass"
          />
        </View>
        <Button onPress={handleSubmit} title="Submit" />
      </View>
    )}
  </Formik>
  )
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
          headerRight: () => (
            <Button
              title="New" onPress={() => navigation.navigate('NewShop')}
            />
          )
        }}
        component={ShopsHome}
      />
      <Stack.Screen name="Shop" component={OpenShop} />
      <Stack.Screen name="NewShop" component={NewShop} />
      <Stack.Screen name="ShopList" component={ShopList} />
      <Stack.Screen name="NewItem" component={NewItem} />
    </Stack.Navigator>
  );
}
