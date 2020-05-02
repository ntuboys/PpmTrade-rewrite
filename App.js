import * as React from 'react';
import { AsyncStorage, Button, Alert, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Formik } from 'formik';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeRoot from './components/home';
import ShopsRoot from './components/shops';
import { AuthContext, UserContext } from './components/contexts';

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function SignInScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

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
      <View>
        <Button
          title="SignUp" onPress={() => {
            navigation.navigate('SignUp');
          }}
        />
      </View>
    </View>
  );
}

function signUpScreen() {
  const { signUp } = React.useContext(AuthContext);
  return (
    <View>
      <Formik
        initialValues={{ username: null, password: null, confPassword: null, email: null, invBy: null }}
        onSubmit={(values) => {
          console.log(values);
          if (values.password === values.confPassword) {
            signUp({ username: values.username, password: values.password, email: values.email, invBy: values.invBy });
          } else {
            Alert.alert(
              'Passwords not the same',
              'msg',
              [{ text: 'OK' }],
              { cancelable: false },
            );
          }
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
            <View style={{ flexDirection: 'row' }}>
              <Text>email</Text>
              <TextInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                style={{ width: 200, backgroundColor: 'white' }}
                placeholder="email"
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text>Password again</Text>
              <TextInput
                onChangeText={handleChange('confPassword')}
                onBlur={handleBlur('confPassword')}
                value={values.confPassword}
                style={{ width: 200, backgroundColor: 'white' }}
                placeholder="pass again"
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text>invited by</Text>
              <TextInput
                onChangeText={handleChange('invBy')}
                onBlur={handleBlur('invBy')}
                value={values.invBy}
                style={{ width: 200, backgroundColor: 'white' }}
                placeholder="invBy"
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
  const [state, dispatch] = React.useReducer(
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
        default:
          throw Error('invalid case');
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      userUsername: null,
      cartItems: [],
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      let userUsername;

      try {
        userToken = await AsyncStorage.getItem('userToken');
        userUsername = await AsyncStorage.getItem('userUsername');
      } catch (e) {
        // Restoring token failed
      }

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", userToken);
      myHeaders.append("username", userUsername);

      var urlencoded = new URLSearchParams();

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: '',
        redirect: 'follow'
      };

      fetch("http://13.77.96.221:4000/auth/token", requestOptions)
        .then(response => response.text())
        .then(async (result) => {
          result = JSON.parse(result);
          if (result.message === "valid") {
            dispatch({ type: 'RESTORE_TOKEN', token: userToken, username: userUsername });
          } else {
            console.log('not valid, signing out');
            dispatch({ type: 'RESTORE_TOKEN', token: null, username: null });
          }
        })
        .catch(error => console.log('error', error.message));
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

        fetch('http://13.77.96.221:4000/auth/login', requestOptions)
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
              [{ text: 'OK' }],
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
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        console.log(`signup data:`);
        console.log(data);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var urlencoded = new URLSearchParams();
        urlencoded.append("password", data.password);
        urlencoded.append("email", data.email);
        urlencoded.append("username", data.username);
        console.log(urlencoded);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(data),
          redirect: 'follow'
        };

        fetch("http://13.77.96.221:4000/auth/register", requestOptions)
          .then(response => response.text())
          .then(result => {

            result = JSON.parse(result);
            if (!result.username || !result.email) {
              throw Error(result.message);
            }
            Alert.alert("success?", "try to sign in");
          })
          .catch(error =>
            Alert.alert("error", error.message));
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
            <Stack.Screen name="SignUp" component={signUpScreen} />
          </Stack.Navigator>
        ) : (
              <UserContext.Provider value={state}>
                <Drawer.Navigator initialRouteName="Home">
                  <Drawer.Screen name="Home" component={HomeRoot} />
                  <Drawer.Screen name="Shops" component={ShopsRoot} />
                </Drawer.Navigator>
              </UserContext.Provider>
            )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
