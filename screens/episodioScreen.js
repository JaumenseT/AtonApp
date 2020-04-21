import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, 
         TextInput, ActivityIndicator, ScrollView,
         SafeAreaView, Button, Dimensions, RefreshControlBase, Image} from 'react-native';
import {ToastAndroid} from 'react-native';
import TVDB from 'node-tvdb';
import config from '../config';
import constants from '../constants';
import ScalableImage from "react-native-scalable-image";
import { Divider, Icon } from 'react-native-elements';

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
        this.datosSerie = tvdb.getSeriesAllById(this.idSerie);
    }

    componentDidMount() {
        this.setState({status: constants.WAITING});
        let r1 = this.ObtenerEpisodio();
        let r2 = this.ObtenerInformacion();
        Promise.all([r1, r2])
        .then((resultados) => {
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
            });
            console.log(this.state.episodeBanner);
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
                                <ScalableImage
                                    width={Dimensions.get('window').width} 
                                    source={{uri: this.state.episodeBanner}}>
                                </ScalableImage>
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
      width: 120,
      borderRadius: 5,
      backgroundColor: "#065471",
      padding: 5,
      alignItems: "center"
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
      fontSize: 30,
      fontWeight: "bold",
      color: "#ffc045",
      padding: 5,
      alignSelf: "center",
      fontFamily: "sans-serif"
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
      width: "90%",
      height: "90%",
      borderColor: "white",
      borderWidth: 1,
      alignSelf: "center",
      marginTop: 5
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