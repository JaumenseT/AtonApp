import 'react-native-gesture-handler';
import * as React from 'react';
import {Text, Image, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './screens/loginScreen';
import SerieScreen from './screens/serieScreen';
import RegisterScreen from './screens/registerScreen';
import TemporadaScreen from './screens/temporadaScreen';
import EpisodioScreen from "./screens/episodioScreen";
import HomeScreen from './screens/homeScreen';

const Stack = createStackNavigator();

/*function LogoTitle() {
  return (
    <View style={{width: "100%", flexDirection: "row", backgroundColor: "white"}}>
      <Image
        style={{ width: 100, height: 100, alignSelf: "flex-end"}}
        source={require('./images/logo_transparent.png')}
      />
    </View>
  );
}*/

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#282828',
            shadowColor: "transparent",
            shadowRadius: 0,
            shadowOffset: {
              height: 0
            }
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'normal',
          },
        }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "#065471"
            }
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "#065471"
            }
          }}
        />        
        <Stack.Screen
          name="Serie"
          component={SerieScreen}
          options={{
            title: "",
          }}
        />

        <Stack.Screen
          name="Temporada"
          component={TemporadaScreen}
          options={{
            title: "",
          }}
        />

        <Stack.Screen
          name="Episodio"
          component={EpisodioScreen}
          options={{
            title: "",
          }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}