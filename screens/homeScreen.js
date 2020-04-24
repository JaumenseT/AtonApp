import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, 
         TextInput, ActivityIndicator, ScrollView,
         SafeAreaView, Button, Dimensions, RefreshControlBase, Image, ImageBackground} from 'react-native';
import {ToastAndroid} from 'react-native';
import TVDB from 'node-tvdb';
import config from '../config';
import constants from '../constants';
import ScalableImage from "react-native-scalable-image";
import { Divider, Icon } from 'react-native-elements';

function SerieComponent(props) {
    return (
        <TouchableOpacity 
        style={{flexDirection: "row", backgroundColor: "#3e3e3e", marginTop: 10, alignItems: "center", margin: 10}}
        onPress={props.onPress}>
            <Image
            source={{uri: config.tvdbURL + props.image}} 
            style={{width:100, height:130}} 
            resizeMode="cover">
            </Image>
            <Text style={styles.serieTitle} numberOfLines={2}>{props.nameSerie}</Text>
        </TouchableOpacity>
    )
}

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buscador: "",
            series: [],
            buscando: false,
            mensajeError: false,
        }
    }

    buscadorOnChange = (texto) => {
        this.setState({buscador: texto});
        if (texto.length > 2) {
            this.buscarSerie(texto);
        } else if (texto.length == 0){
            this.setState({
                buscando: false,
                series: [],
                mensajeError: null,
            });
        } else {
            this.setState({
                buscando: false,
                series: [],
                mensajeError: "Introduce por los menos 3 carácteres...",
            });
        }
        
    }

    serieOnClick = (id) => {
        this.props.navigation.navigate("Serie", {
            idSerie: id,
        })
    }

    async buscarSerie (textoBuscador) {
        let tvdb = new TVDB(config.tvdb_key, 'es');
        this.setState({buscando: true, mensajeError: false})
        try {
            let datos = await tvdb.getSeriesByName(textoBuscador);
            let aux = [];
            for (let i=0; i<datos.length; i++) {
                if (datos[i].firstAired != null) {
                    aux.push(datos[i]);
                }
            }
            this.setState({
                series: aux.slice(0,49),
                buscando: false,
                mensajeError: null,
            });
            console.log(this.state.series);
        } catch (error) {
            this.setState({
                buscando: false,
                series: [],
                mensajeError: "No se han encontrado resultados para su búsqueda.",
            })
        }
    }

    render() {
        return(
            <SafeAreaView style={styles.container}>
                <ScrollView style={{width: "100%"}}>
                    <View style={{flexDirection: "row", backgroundColor: "white", alignItems: "center", justifyContent: "space-between", paddingRight: 8}}>
                    <TextInput
                    placeholder={"Busca algo aquí..."}
                    onChangeText={this.buscadorOnChange}
                    value={this.state.buscador}
                    style={styles.textoBuscador}>
                    </TextInput>
                    <Icon name="search1" type="antdesign"></Icon>
                    </View>
                    { this.state.buscando && (
                        <View>
                            <ActivityIndicator
                                style={{alignSelf: "center", marginTop: 40}}
                                size="large"
                                color= "white">
                            </ActivityIndicator>
                        </View>
                    )}
                    { !this.state.buscando && this.state.mensajeError && (
                        <Text 
                        style={{backgroundColor: "#c94536", color: "white", padding: 8, fontSize: 15, textAlign: "center", width: "100%"}}
                        >{this.state.mensajeError}</Text>
                    )}

                    { !this.state.buscando  && (
                        this.state.series.map((item) => {
                            return (
                                <SerieComponent 
                                    nameSerie={item.seriesName}
                                    image={item.image}
                                    key={item.id}
                                    onPress= {() => {
                                        this.serieOnClick(item.id);
                                    }}>
                                </SerieComponent>
                            );
                        })
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
    textoBuscador: {
        fontSize: 20,
        color: "black",
        padding: 10,
        flex: 1,
        height: 50,
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
    }
  });
