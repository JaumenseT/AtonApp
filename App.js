import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import {ToastAndroid} from 'react-native';
import TVDB from 'node-tvdb';
import config from './config';
import constants from './constants';


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

const URLPoster = "https://artworks.thetvdb.com/banners/";

export default class RegisterScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idSerie: 367559,
      status: constants.WAITING,
      title: "",
      imagenSerie: "",
      descripcion: "",
    }
  }

  getSeriesById = async function(id) {
    
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
        this.setState({title: response.seriesName,
            imagenSerie: URLPoster + response.poster,
            descripcion: response.overview,
            status: constants.OK});
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
        <ScrollView>
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
          <View style={{flex: 1, flexDirection: "row", alignContent: "center", justifyContent: 'center', alignItems: "center"}}>
            <View style={{flex: 1, height: 275}}>
              <Image
                style={styles.imageStyle}
                source={{uri: this.state.imagenSerie}}>
              </Image>
            </View>
              <View style={{flex: 1}}>
                <Text>Hola</Text>
              </View>
          </View>
          <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center', flexDirection: "row" }}>
            <View style={{flex: 2}}>
              <Text style={styles.descripcionText}>
                {this.state.descripcion}
              </Text>
            </View>
          </View>
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
    backgroundColor: '#065471'
  },
  textoLogin: {
    fontSize: 20,
    color: "white"
  },
  descripcionText: {
    fontSize: 20,
    color: "#f7f7f7",
    marginLeft: 5,
    marginRight: 5
  },
  titleText: {
    margin: 5,
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    padding: 5
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
    borderColor: "#ffc045",
    borderWidth: 1,
  }
});