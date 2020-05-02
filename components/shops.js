import React, { useState } from 'react';
import { Button, View, Text, TextInput, StyleSheet, Platform, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext, UserContext, CartContext } from './contexts.js';
import { Formik } from 'formik';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

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
  const getShops = () => {
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

    fetch("http://13.77.96.221:4000/shop/", requestOptions)
      .then(response => response.text())
      .then(result => {
        result = JSON.parse(result);
        console.log(result);
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
          let view = [];
          shop.shopStock.map(item => {
            if (item.name || item.price || item.shopName) {

              view.push(
                <TouchableOpacity key={item._id} onPress={() => navigation.navigate('ItemView', { item: item, shop: shop.shopId })} style={{ borderBottomColor: 'black', borderBottomWidth: 2 }}>
                  <Text>item name: {item.name}</Text>
                  <Text>item desc: {item.desc}</Text>
                  <Text>item price: {item.price}</Text>
                  <Text>shop name: {shop.shopName}</Text>
                </TouchableOpacity>
              );
            }
          });
          return view;
        })}
      <Button title="Refresh" onPress={() => getShops()} />
    </View >
  )
}

function ItemView({ route, navigation }) {
  const { item, shop } = route.params;
  return (
    <View>
      <Text>Item view!</Text>
      <Text>{item.name}</Text>
      <Text>{item.price}</Text>
      <Button title="Buy Now" onPress={() => navigation.navigate('BuyItem', { item: item, shop: shop })} />
    </View>
  )
}

function BuyItem({ route, navigation }) {
  const { item, shop, auth } = route.params;
  const { fname, lname, fline, sline, postcode } = route.params;
  const address = {
    fname,
    lname,
    fline,
    sline,
    postcode,
  };

  function buyItem(order) {
    console.log(order);
    console.log(item);
    console.log(shop);
    var myHeaders = new Headers();
    myHeaders.append("token", auth.userToken);
    myHeaders.append("username", auth.userUsername);
    myHeaders.append("Content-Type", "application/json");
    order.shopId = shop;
    order.item = item._id;
    order.address = address;
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(order),
      redirect: 'follow'
    };

    fetch("http://13.77.96.221:4000/shop/create", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  return (
    <View>
      <Formik
        initialValues={{ fname: null, lname: null, fline: null, sline: null, postcode: null }}
        onSubmit={(values) => {
          buyItem({ fname: values.fname, lname: values.lname, fline: values.fline, sline: values.sline, postcode: values.postcode });
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text>fname</Text>
              <TextInput
                onChangeText={handleChange('fname')}
                onBlur={handleBlur('fname')}
                value={values.fname}
                style={{ width: 200, backgroundColor: 'white' }}
                placeholder="arek"
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text>lname</Text>
              <TextInput
                onChangeText={handleChange('lname')}
                onBlur={handleBlur('lname')}
                value={values.lname}
                style={{ width: 200, backgroundColor: 'white' }}
                placeholder="pass"
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text>fline</Text>
              <TextInput
                onChangeText={handleChange('fline')}
                onBlur={handleBlur('fline')}
                value={values.fline}
                style={{ width: 200, backgroundColor: 'white' }}
                placeholder="pass"
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text>sline</Text>
              <TextInput
                onChangeText={handleChange('sline')}
                onBlur={handleBlur('sline')}
                value={values.sline}
                style={{ width: 200, backgroundColor: 'white' }}
                placeholder="pass"
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text>postcode</Text>
              <TextInput
                onChangeText={handleChange('postcode')}
                onBlur={handleBlur('postcode')}
                value={values.postcode}
                style={{ width: 200, backgroundColor: 'white' }}
                placeholder="pass"
              />
            </View>
            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>
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

      fetch(`http://13.77.96.221:4000/shop/${shop._id}/inventory/add`, requestOptions)
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
    <UserContext.Consumer>
      {value => {
        return (
          <Stack.Navigator>
            <Stack.Screen name="ShopList" initialParams={{ auth: value }} component={ShopList} />
            <Stack.Screen name="ItemView" initialParams={{ auth: value }} component={ItemView} />
            <Stack.Screen name="BuyItem" initialParams={{ auth: value }} component={BuyItem} />
          </Stack.Navigator>
        );
      }}
    </UserContext.Consumer>
  );
}
