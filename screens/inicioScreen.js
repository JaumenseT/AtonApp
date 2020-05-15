import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, SafeAreaView, ScrollView } from 'react-native';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import config from '../config';
import { Icon } from "react-native-elements";
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './loginScreen';
import SerieScreen from './serieScreen';
import RegisterScreen from './registerScreen';
import TemporadaScreen from './temporadaScreen';
import EpisodioScreen from "./episodioScreen";
import HomeScreen from './homeScreen';

const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();

function HomeStackScreen() {
    return (
            <HomeStack.Navigator
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

                <HomeStack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        headerShown: false
                    }}
                />

                <HomeStack.Screen
                    name="Serie"
                    component={SerieScreen}
                    options={{
                        title: "",
                    }}
                />

                <HomeStack.Screen
                    name="Temporada"
                    component={TemporadaScreen}
                    options={{
                        title: "",
                    }}
                />

                <HomeStack.Screen
                    name="Episodio"
                    component={EpisodioScreen}
                    options={{
                        title: "",
                    }}
                />

            </HomeStack.Navigator>
    );
}

export default class InicioScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
                <Tab.Navigator
                    tabBarOptions={{
                        activeBackgroundColor: "black", inactiveBackgroundColor: "black", activeTintColor: "#ffc045",
                        keyboardHidesTabBar: true,
                        style: {
                            height: 55,
                        }
                    }}>
                    <Tab.Screen 
                        options={{
                            tabBarIcon: ({color}) => (
                                <Icon name="home" type="entypo"  color={color}></Icon>
                            ),
                        }} 
                        name="Home" 
                        component={HomeStackScreen} />
                    <Tab.Screen
                        options={{
                            tabBarIcon: ({color}) => (
                                <Icon name="tv" type="entypo" color={color}></Icon>
                            ),
                        }} 
                        name="Login" 
                        component={LoginScreen} />
                    <Tab.Screen 
                        options={{
                            tabBarIcon: ({color}) => (
                                <Icon name="user" type="entypo" color={color}></Icon>
                            ),
                        }} 
                        name="Register" 
                        component={RegisterScreen} />
                </Tab.Navigator>
        );
    }
}