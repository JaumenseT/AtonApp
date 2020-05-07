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
import AsyncStorage from '@react-native-community/async-storage';

async function GetCapituloUsuario(idCapitulo) {
  let token = await AsyncStorage.getItem("token");
  let headers=new Headers();
  headers.append("Content-Type",  "application/json");
  headers.append("Accept-Language", "es");
  headers.append("Authorization", "Bearer "+token);
  console.log(idCapitulo);
  let resultado = await fetch(config.endpoint+"Capitulo?id="+idCapitulo,
                  {
                    method: "GET",
                    headers: headers,
                  });
  let json = await resultado.json();
  if (json.error) {
    throw new Error(json.error);
  } else {
    return json;
  }
} 

async function GestionarVisto(idCapitulo, idSerie, numEpisodio, numTemporada, view) {
  let token = await AsyncStorage.getItem("token");
  let headers=new Headers();
  headers.append("Content-Type",  "application/json");
  headers.append("Accept-Language", "es");
  headers.append("Authorization", "Bearer "+token);
  let resultado = await fetch(config.endpoint+"Capitulo?idCapitulo="+idCapitulo+"&idSerie="+idSerie+
                  "&numCapitulo="+numEpisodio+"&numTemporada="+numTemporada,
                  {
                    method: view ? "POST" : "DELETE",
                    headers: headers,
                  });
}


export default class EpisodioScreen extends Component {
    constructor(props) {    
      super(props);
      this.state = {
        status: constants.WAITING,
        tituloSerie: "",
        numTemporada: "",
        directorEpisodio: null,
        writersEpisodio: null,
        fechaEpisodio: "",
        ratingEpisodio: "",
        tituloEpisodio: "",
        numEpisodio: "",
        episodeBanner: "",
        descripcionEpisodio: "",
        numValoraciones: "",
        statusEpisodio: false
      }
      this.idSerie = this.props.route.params.idSerie;
      this.idEpisodio = this.props.route.params.idEpisodio;
    }

    async ObtenerEpisodio() {
        let tvdb = new TVDB(config.tvdb_key, 'es');
        this.datosEpisodio = await tvdb.getEpisodeById(this.idEpisodio);
    }

    async ObtenerInformacion() {
        let tvdb = new TVDB(config.tvdb_key, 'es');
        this.datosSerie = await tvdb.getSeriesAllById(this.idSerie);
    }

    volverSerie = () => {
        this.props.navigation.navigate('Serie', {idSerie: this.idSerie});
    }

    volverTemporada = () => {
        this.props.navigation.navigate('Temporada', {
            idSerie: this.idSerie,
            numTemporada: this.state.numTemporada,
        })
    }

    switchCapitulo = () => {
      GestionarVisto(this.idEpisodio, this.idSerie, this.state.numEpisodio, this.state.numTemporada, !this.state.statusEpisodio);
      this.setState({
        statusEpisodio: !this.state.statusEpisodio,
      });
    }

    componentDidMount() {
        this.setState({status: constants.WAITING});
        let r1 = this.ObtenerEpisodio();
        let r2 = this.ObtenerInformacion();
        let r3 = GetCapituloUsuario(this.idEpisodio)
          .then(response => {
            this.setState({
              statusEpisodio: "IdCapitulo" in response,
            });
          })
          .catch(error => {
            ToastAndroid.showWithGravity(error.message, ToastAndroid.LONG, ToastAndroid.TOP);
          }); 
        Promise.all([r1, r2, r3])
        .then((resultados) => {
            console.log(this.datosSerie);
            this.setState({
                status: constants.OK,
                tituloSerie: this.datosSerie.seriesName,
                numTemporada: this.datosEpisodio.airedSeason,
                directorEpisodio: this.datosEpisodio.directors,
                writersEpisodio: this.datosEpisodio.writers,
                fechaEpisodio: this.datosEpisodio.firstAired,
                ratingEpisodio: this.datosEpisodio.siteRating,
                tituloEpisodio: this.datosEpisodio.episodeName,
                numEpisodio: this.datosEpisodio.airedEpisodeNumber,
                episodeBanner: config.URLBanner + this.datosEpisodio.filename,
                descripcionEpisodio: this.datosEpisodio.overview,
                numValoraciones: this.datosEpisodio.siteRatingCount,
            });
        })
        .catch(error => {
            console.info(error);
            this.setState({status: constants.ERROR})
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
                            <View>
                                <ImageBackground
                                    style={styles.imageStyle}
                                    source={{uri: this.state.episodeBanner}}>
                                        <Text style={styles.titleText}>{this.state.numEpisodio} | {this.state.tituloEpisodio}</Text>
                                        <TouchableOpacity style={styles.leerMasButton} onPress={this.volverSerie}>
                                            <Text style={{color: "white", fontFamily: "sans-serif"}}>{this.state.tituloSerie}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.leerMasButton} onPress={this.volverTemporada}>
                                            <Text style={{color: "white", fontFamily: "sans-serif"}}>Temporada {this.state.numTemporada}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.switchCapitulo} style={{alignSelf: "flex-end", backgroundColor: "#000000CC",
                                                                padding: 3, borderRadius: 25, marginRight: 8, marginBottom: 3}}>
                                                                
                                          {!this.state.statusEpisodio && (
                                            <Icon name="pluscircleo" type="antdesign" color="#ffc045" size={40}></Icon>
                                          )}
                                          {this.state.statusEpisodio && (
                                            <Icon name="checkcircle" type="antdesign" color="#ffc045" size={40}></Icon>
                                          )}
                                        </TouchableOpacity>
                                </ImageBackground>
                                <Text style={styles.descripcionText}>{this.state.descripcionEpisodio}</Text>
                                <Divider
                                    style={{backgroundColor: "#ffc045", borderWidth: 3, height: 8, borderColor: "#065471"}}>
                                </Divider>
                                <Text style={styles.descripcionText}>Rating: {this.state.ratingEpisodio} ({this.state.numValoraciones} valoraciones)</Text>
                                <Text style={styles.descripcionText}>Fecha de emisión: {this.state.fechaEpisodio}</Text>
                                <Text style={styles.descripcionText}>Director: {this.state.directorEpisodio.join(", ")}</Text>
                                <Text style={styles.descripcionText}>Guionistas: {this.state.writersEpisodio.join(", ")}</Text>
                            </View>
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