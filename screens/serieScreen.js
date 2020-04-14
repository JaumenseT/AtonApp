import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ActivityIndicator, ScrollView, SafeAreaView, Button } from 'react-native';
import {ToastAndroid} from 'react-native';
import TVDB from 'node-tvdb';
import config from './config';
import constants from './constants';
import { Divider, Icon } from 'react-native-elements';


async function getSeriesById(id) {
  let headers=new Headers();
  headers.append("Content-Type",  "application/json");
  headers.append("Accept-Language", "es");
  let resultado = await fetch("https://api.thetvdb.com/login", 
    {
      method: 'POST', 
      headers: headers,
      body: JSON.stringify({
        apikey : config.tvdb_key,
      })
    });
  let json = await resultado.json();
  let token=json.token;
  headers.append('Authorization', 'Bearer '+token);
  resultado = await fetch("https://api.thetvdb.com/series/"+id, 
  {
    method: 'GET', 
    headers: headers,
  });  
  return resultado.json();  
}

function SeccionesLaterales(props) {
  return (
    <View style={{flexDirection: "row"}}>
      <Text style={styles.seccionesTextTitle}>{props.name}: </Text>
      <Text style={styles.seccionesTextValue}>{props.value}</Text>
      
    </View>
  )
}

function TemporadasComponent(props) {
  return (
    <TouchableOpacity style={styles.temporadaStyle}>
      <Text style={styles.temporadaTitle}>Temporada {props.numeroTemporada}</Text>
      <View style={{flexDirection: "row"}}>
        <Text style={styles.episodioStyle}>{props.numeroEpisodios}</Text>
        <Icon name='right' type='antdesign'></Icon>
      </View>
    </TouchableOpacity>
  )
}

const URLPoster = "https://artworks.thetvdb.com/banners/";

export default class RegisterScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idSerie: 281621,
      status: constants.WAITING,
      title: "",
      imagenSerie: "",
      descripcion: "",
      puntuacionSerie: "",
      estadoSerie: "",
      platformSerie: "",
      numTemporadas: "",
      temporadas: null,
      descripcionCorta: "",
      existeDescripcionCorta: false
    }
  }

  getSeriesById = async function(id) {
    
  }

  onPressShowMore = () => {
    this.setState({existeDescripcionCorta: false})
  }
  componentDidMount() {
    this.setState({status: constants.WAITING});
    let tvdb = new TVDB("65bad5c8795f9d6e359b1b0c9b9b3145");
    tvdb.language = "es";
    console.log(config.tvdb_key);
    console.log(this.state.idSerie);

    
    /*getSeriesById(this.state.idSerie)
      .then(response => {
        this.setState({title: response.data.seriesName, status: constants.OK});
      }).catch(error => {
        console.info(error);
        this.setState({status: constants.ERROR})
      });*/
    
    tvdb.getSeriesAllById(this.state.idSerie)
      .then(response => {
        console.log(response);
        let auxTemporada = [];
        for (let i = 1; i<=response.season; i++) {
          console.log(i);
          auxTemporada.push({
            num: i,
            episodios: 0,
            idTemporada: 0
          });
        }
        for(let e of response.episodes) {
          if(e.airedSeason != 0 && e.airedSeason<=auxTemporada.length) {
            let t = auxTemporada[e.airedSeason-1];
            t.episodios++;
            t.idTemporada = e.airedSeasonID;
          } 
        }
        this.setState({title: response.seriesName,
            imagenSerie: URLPoster + response.poster,
            descripcion: response.overview,
            puntuacionSerie: response.siteRating.toString(),
            estadoSerie: response.status,
            numTemporadas: response.season,
            platformSerie: response.network,
            temporadas: auxTemporada,
            status: constants.OK});

        let auxDescripcion = this.state.descripcion.split(" ");
        if (auxDescripcion.length > 50) {
          this.setState({
            descripcionCorta: auxDescripcion.slice(0, 49).join(" ")+"...",
            existeDescripcionCorta: true,
          })
        }
        console.log(auxDescripcion.length);
        
      }).catch(error => {
        console.info(error);
        this.setState({status: constants.ERROR})
      });
  }

  /*registerUser = () => {
    console.log(this.DB_URL + "/usuarios?_sort=id&_order=desc&_limit=1");
    fetch(this.DB_URL + "/usuarios?_sort=id&_order=desc&_limit=1")
      .then(resp => resp.json())
      .then(data => {
        console.log(data[0].id + 1);
        let dades = {
          id: data[0].id + 1,
          user: this.state.user,
          password: this.state.password,
          admin: false
        };
        console.log(JSON.stringify(dades));
        fetch(this.DB_URL + "/usuarios", {
          method: 'POST',
          body: JSON.stringify(dades),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        })
          .then(resp => {
            ToastAndroid.showWithGravity('Usuario registrado correctamente', ToastAndroid.LONG, ToastAndroid.TOP),
            this.props.navigation.navigate('Login');
          });

      });

  }*/

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
            <Text style={styles.titleText}>
              {this.state.title}
            </Text>
          </View>
          <View style={{flexDirection: "row", alignContent: "center", justifyContent: 'center', alignItems: "center"}}>
            <View style={{flex: 1, height: 275}}>
              <Image
                style={styles.imageStyle}
                source={{uri: this.state.imagenSerie}}>
              </Image>
            </View>
              <View style={{flex: 1, flexDirection: "column", justifyContent: 'flex-start', height: "100%"}}>
                <SeccionesLaterales name="Rating" value={this.state.puntuacionSerie}></SeccionesLaterales>
                <SeccionesLaterales name="Temporadas" value={this.state.numTemporadas}></SeccionesLaterales>
                <SeccionesLaterales name="Plataforma" value={this.state.platformSerie}></SeccionesLaterales>
                <SeccionesLaterales name="Estado" value={this.state.estadoSerie}></SeccionesLaterales>
              </View>
          </View>
          <Divider
          style={{backgroundColor: "#ffc045", borderWidth: 3, height: 8, borderColor: "#065471"}}>
          </Divider>
          { !this.state.existeDescripcionCorta && (
            <View style={{alignContent: 'center', justifyContent: 'center', alignItems: 'center', flexDirection: "column", marginBottom: 8}}>
              <Text style={styles.descripcionText}>
                {this.state.descripcion}
              </Text>
            </View>
          )}
          { this.state.existeDescripcionCorta && (
            <View style={{alignContent: 'center', justifyContent: 'center', alignItems: 'center', flexDirection: "column", marginBottom: 8}}>
              <Text style={styles.descripcionText}>
                {this.state.descripcionCorta}
              </Text>
              <TouchableOpacity style={styles.leerMasButton} onPress={this.onPressShowMore}>
                <Text style={{color: "white", fontFamily: "sans-serif"}}>Mostrar más...</Text>
              </TouchableOpacity>
            </View>
          )}
          {this.state.temporadas.map((item) => {
            return (
              <TemporadasComponent numeroTemporada={item.num} numeroEpisodios={item.episodios}></TemporadasComponent>
              );
          })}
          </React.Fragment>
        )}
        </ScrollView>
      </SafeAreaView>
    );
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