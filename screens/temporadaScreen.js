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


function EpisodeComponent(props) {
  return (
    <TouchableOpacity 
      style={{flexDirection: "row", backgroundColor: "#3e3e3e", margin: 8, alignItems: "center"}}
      onPress={props.onPress}>
        <Image
          source={{uri: config.URLBanner + props.episode.filename}} 
          style={{width:100, height:75}} 
          resizeMode="cover">
        </Image>
        <Text style={styles.capituloTitle} numberOfLines={2}>{props.episode.airedEpisodeNumber + " "}| {props.episode.episodeName}</Text>
    </TouchableOpacity>
  )
}


export default class TemporadaScreen extends Component {
  constructor(props) {    
    super(props);
    this.state = {
      nombreSerie: "",
      status: constants.WAITING,
      banner: "",
      episodios: null,
      tituloTemporada: "Temporada " + props.route.params.numTemporada,
    }
    this.idSerie = this.props.route.params.idSerie;
  }

  episodioClick = (idEpisodio) => {
    this.props.navigation.navigate("Episodio", {
      idSerie: this.idSerie,
      idEpisodio: idEpisodio
    })
  }

  async obtenerInformacion() {
    let tvdb = new TVDB(config.tvdb_key, 'es');
    this.datosSerie = await tvdb.getSeriesAllById(this.idSerie);
  }

  obtenerCapitulos() {
    let auxCapitulos = [];
    for (let i=0; i<this.datosSerie.episodes.length; i++) {
      if (this.datosSerie.episodes[i].airedSeason == this.props.route.params.numTemporada) {
        auxCapitulos.push(this.datosSerie.episodes[i]);
      }
    }
    auxCapitulos.sort((e1, e2) => {
      return e1.airedEpisodeNumber - e2.airedEpisodeNumber
    })
    this.setState({
      episodios: auxCapitulos,
    })
  }

  async obtenerImagen() {
    let tvdb = new TVDB(config.tvdb_key);
    try {
      let response = await tvdb.getSeriesImages(this.idSerie, null, {query: {keyType: "seasonwide", subKey: this.props.route.params.numTemporada}});
      this.setState({
        banner: config.URLBanner + response[0].fileName,
      });
    } catch (error) {
      try {
        let response = await tvdb.getSeriesAllById(this.idSerie);
        this.setState({
          banner: config.URLBanner + response.banner,
        });
      } catch (error) {
        //
      }
    }
  }

  componentDidMount() {
    this.setState({status: constants.WAITING});
    let r1=this.obtenerInformacion();
    let r2=this.obtenerImagen();
    Promise.all([r1, r2])
      .then((resultados) => {
        this.obtenerCapitulos();
        console.log(this.state.episodios);
        this.setState({
          status: constants.OK,
          nombreSerie: this.datosSerie.seriesName,
        });
      }); 
  }

  volverSerie = () => {
    this.props.navigation.navigate('Serie', {idSerie: this.idSerie});
  }

  render() {
    return (
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
                  source={{uri: this.state.banner}}>
                </ScalableImage>
                <Text style={styles.titleText}>{this.state.tituloTemporada}</Text>
                <TouchableOpacity style={styles.leerMasButton} onPress={this.volverSerie}>
                  <Text style={{color: "white", fontFamily: "sans-serif"}}>{this.state.nombreSerie}</Text>
                </TouchableOpacity>
                {this.state.episodios.map((item, i) => {
                  return (
                    <EpisodeComponent
                    episode={item}
                    key={i}
                    onPress={ () => {
                      this.episodioClick(item.id);
                    }}>
                    </EpisodeComponent>
                  )
                })}
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
    backgroundColor: "#065471",
    padding: 5,
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 10
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
    margin: 6,
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffc045",
    padding: 5,
    alignSelf: "flex-start",
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
  capituloTitle: {
    fontSize: 20,
    fontFamily: "sans-serif",
    color: "white",
    flex: 1,
    padding: 8
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