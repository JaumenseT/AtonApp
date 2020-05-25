import React, { Component } from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity,
    TextInput, ActivityIndicator, ScrollView,
    SafeAreaView, Button, Dimensions, RefreshControlBase, Image, ImageBackground
} from 'react-native';
import { ToastAndroid } from 'react-native';
import config from '../config';
import constants from '../constants';
import AsyncStorage from '@react-native-community/async-storage';


async function GetDatosUsuario() {
    let token = await AsyncStorage.getItem("token");
    let headers=new Headers();
    headers.append("Content-Type",  "application/json");
    headers.append("Accept-Language", "es");
    headers.append("Authorization", "Bearer "+token);
    let resultado = await fetch(config.endpoint+"Usuarios",
                    {
                      method: "GET",
                      headers: headers,
                    });
    let json = await resultado.json();
    console.log(json);
    if (json.error) {
      throw new Error(json.error);
    } else {
      return json;
    }
} 


export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: constants.WAITING,
            name: "",
            userName: "",
            seriesVistas: null,
            episodiosVistos: null,
        }
    }

    componentDidMount() {
        this.setState({status: constants.WAITING});
        this.props.navigation.addListener('focus', () => {
            GetDatosUsuario()
            .then(response => {
                this.setState({
                    status: constants.OK,
                    name: response.user.Name,
                    userName: response.user.UserName,
                    seriesVistas: response.seriesVistas,
                    episodiosVistos: response.episodiosVistos,
                })
            });
        });
    }

    logout = () => {
        this.props.navigation.navigate('Login');
    }

    render() {
        return(
            <SafeAreaView style={styles.container}>
                <ScrollView style={{width:"100%"}}>
                    { this.state.status==constants.WAITING && (
                        <View>
                            <ActivityIndicator
                                style={{alignSelf: "center", marginTop: 40}}
                                size="large"
                                color= "white">
                            </ActivityIndicator>
                        </View>
                    )}
                    { this.state.status==constants.OK && (
                        <View style={{alignItems: "center"}}>
                            <Text style={styles.tituloPantalla}>
                                Perfil
                            </Text>
                            <Image
                                source={require('../images/profile.png')}
                                style={{ width: 150, height: 150, margin: 10 }}
                                resizeMode="cover">
                            </Image>
                            <View style={{flexDirection: "row"}}>
                                <Text style={styles.serieTitle}>
                                    Username:
                                </Text>
                                <Text style={styles.datosUsuario}>
                                    {this.state.userName}
                                </Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={styles.serieTitle}>
                                    Name:
                                </Text>
                                <Text style={styles.datosUsuario}>
                                    {this.state.name}
                                </Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={styles.serieTitle}>
                                        Series:
                                    </Text>
                                    <Text style={styles.datosUsuario}>
                                        {this.state.seriesVistas}
                                    </Text>
                                </View>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={styles.serieTitle}>
                                        Episodios:
                                    </Text>
                                    <Text style={styles.datosUsuario}>
                                        {this.state.episodiosVistos}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                    style={styles.button}
                                    onPress={this.logout}>
                                    <Text style={styles.buttonText}>
                                        Salir
                                    </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#282828',
      alignContent: "center"
    },
    leerMasButton: {
      alignSelf: "flex-start",
      borderRadius: 5,
      backgroundColor: "#065471cc",
      padding: 5,
      alignItems: "center",
      margin: 6
    },
    textoLogin: {
      fontSize: 20,
      color: "white"
    },
    descripcionText: {
      fontSize: 15,
      color: "#fafafa",
      marginLeft: 5,
      marginRight: 5,
      padding: 7,
      fontFamily: "sans-serif"
    },
    sinopsisText: {
      fontSize: 20,
      color: "#fafafa",
      marginLeft: 5,
      marginRight: 5,
      padding: 7,
      fontFamily: "sans-serif",
      alignSelf: "flex-start"
    },
    seccionesTextTitle: {
      fontSize: 18,
      color: "#fafafa",
      marginLeft: 5,
      marginRight: 0,
      paddingBottom: 5,
      fontFamily: "sans-serif"
    },
    textInput: {
        borderColor: 'black',
        borderWidth: 1,
        fontSize: 16,
        color: 'black',
        backgroundColor: 'white',
        borderRadius: 5,
        margin: 5,
        padding: 5,
      },
    seccionesTextValue: {
      fontSize: 18,
      color: "#ffc045",
      marginLeft: 0,
      marginRight: 5,
      paddingBottom: 5,
      fontFamily: "sans-serif"
    },
    titleText: {
      margin: 5,
      fontSize: 25,
      backgroundColor: "#000000aa",
      fontWeight: "bold",
      color: "#ffc045",
      paddingVertical: 3,
      paddingHorizontal: 6,
      borderRadius: 5,
      alignSelf: "center",
      fontFamily: "sans-serif",
      alignSelf: "flex-start"
    },
    button: {
      width: 275,
      paddingTop: 8,
      paddingBottom: 8,
      marginTop: 7,
      borderRadius: 5,
      backgroundColor: "#ffc045"
    },
    buttonText: {
      fontSize: 20,
      textAlign: 'center',
      color: 'black',
      fontWeight: 'bold'
    },
    imageStyle: {
      alignSelf: 'center',
      resizeMode: "center",
      width: Dimensions.get('window').width,
      minHeight: (Dimensions.get('window').width)*0.40,
      alignSelf: "center",
      marginBottom: 5,
    },
    temporadaStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "90%",
      backgroundColor: "#ffc045",
      borderRadius: 5,
      alignSelf: "center",
      padding: 8,
      marginVertical: 8,
    },
    temporadaTitle: {
      fontSize: 20,
      fontFamily: "sans-serif",
      color: "black"
    },
    serieTitle: {
        fontSize: 20,
        fontFamily: "sans-serif",
        color: "#ffc045",
        padding: 8,
        alignSelf: "center"
    },
    datosUsuario: {
        fontSize: 20,
        fontFamily: "sans-serif",
        color: "white",
        padding: 8,
        alignSelf: "center"
    },
    episodioStyle: {
      alignSelf: "center",
      marginRight: 8,
      backgroundColor: "#ffd98f",
      borderRadius: 10,
      paddingVertical: 4,
      paddingHorizontal: 8,
      color: "#33260e"
    },
    tituloPantalla: {
      alignSelf: "flex-start",
      padding: 15,
      fontSize: 30,
      color: "white",
    }
  });