import * as React from 'react';
import { AsyncStorage, Button, Alert, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Formik } from 'formik';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeRoot from './components/home';
import { AuthContext } from './components/contexts';

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function SignInScreen() {
  const [ username, setUsername ] = React.useState('');
  const [ password, setPassword ] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <Formik
        initialValues={{ username: null, password: null }}
        onSubmit={(values) => {
          signIn({ username: values.username, password: values.password });
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text>Username</Text>
              <TextInput
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                style={{ width: 200, backgroundColor: 'white' }}
                placeholder="arek"
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text>Password</Text>
              <TextInput
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                style={{ width: 200, backgroundColor: 'white' }}
                placeholder="pass"
              />
            </View>
            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>
    </View>
  );
}

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App({ navigation }) {
  const [ state, dispatch ] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            userUsername: action.username,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            userUsername: action.username,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            userUsername: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      userUsername: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      let userUsername;

      try {
        userToken = await AsyncStorage.getItem('userToken');
        userToken = await AsyncStorage.getItem('userUsername');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken, username: userUsername });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(data),
          redirect: 'follow',
        };

        fetch('http://192.168.0.23:4000/auth/login', requestOptions)
          .then((response) => response.text())
          .then((result) => {
            result = JSON.parse(result);
            if (result.token) {
              return result;
            }
            const msg = result.message;
            throw new Error(msg);
          })
          .then((result) => {
            // console.log(`username: ${ data.username }, token: ${ result.token }`);
            AsyncStorage.setItem('userUsername', data.username)
              .then(() => {
                AsyncStorage.setItem('userToken', result.token)
                  .then(() => {
                    dispatch({ type: 'SIGN_IN', token: result.token, username: data.username });
                  });
              });
          })
          .catch((error) => {
            Alert.alert(
              'Error',
              error.message,
              [ { text: 'OK' } ],
              { cancelable: false },
            );
          });
      },
      signOut: async () => {
        await AsyncStorage.removeItem('userUsername');
        await AsyncStorage.removeItem('userToken');
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token', username: data.username });
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.isLoading ? (
          <Stack.Navigator>
            <Stack.Screen name="splash" component={SplashScreen} />
          </Stack.Navigator>
        ) : state.userToken == null ? (
          <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignInScreen} />
          </Stack.Navigator>
        ) : (
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomeRoot} />
            <Button
              title="test" onPress={() => {
                console.log('pressed!');
              }}
            />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
