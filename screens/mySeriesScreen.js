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


async function GetSeriesUsuario() {
    let token = await AsyncStorage.getItem("token");
    let headers=new Headers();
    headers.append("Content-Type",  "application/json");
    headers.append("Accept-Language", "es");
    headers.append("Authorization", "Bearer "+token);
    let resultado = await fetch(config.endpoint+"Series",
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

function SerieComponent(props) {
    return (
        <TouchableOpacity
            style={{ flexDirection: "row", backgroundColor: "#3e3e3e", marginTop: 10, alignItems: "center", margin: 10 }}
            onPress={props.onPress}>
            <Image
                source={{ uri: config.URLBanner + props.image }}
                style={{ width: 100, height: 130 }}
                resizeMode="cover">
            </Image>
            <Text style={styles.serieTitle} numberOfLines={2}>{props.nameSerie}</Text>
        </TouchableOpacity>
    )
}

export default class MySeriesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: constants.WAITING,
            series: [],
            buscando: false,
            mensajeError: false,
        }
    }

    serieOnClick = (id) => {
        this.props.navigation.navigate("Serie", {
            idSerie: id,
        })
    }

    componentDidMount() {
        this.setState({status: constants.WAITING});
        this.props.navigation.addListener('focus', () => {
            GetSeriesUsuario()
            .then(response => {
                this.setState({
                    series: response,
                    status: constants.OK,
                });
            }).catch(error => {
                ToastAndroid.showWithGravity(error.message, ToastAndroid.LONG, ToastAndroid.TOP);
            });
        });
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
                      <React.Fragment>
                        <Text style={styles.tituloPantalla}>Mis Series</Text>
                        {
                          this.state.series.map((item) => {
                            return (
                                <SerieComponent
                                nameSerie={item.SeriesName}
                                image={item.SeriesPhoto}
                                key={item.IdSerie}
                                onPress={() => {
                                    this.serieOnClick(item.IdSerie);
                                }}>
                                </SerieComponent>
                            )
                        })
                        }
                      </React.Fragment>
                        
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
        flex: 1
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