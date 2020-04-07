import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import {ToastAndroid} from 'react-native';
import TVDB from 'node-tvdb';
import config from './config';


export default class RegisterScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idSerie: "296762",
      dataLoaded: false,
      title: "",
    }
  }

  componentDidMount() {
    this.setState({dataLoaded: false});
    let tvdb = new TVDB(config.tvdb_key);
    tvdb.getSeriesById(this.state.idSerie)
      .then(response => {
        this.setState({title: response.seriesName, dataLoaded: true});
        console.log("hola");
      }).catch(error => {
        console.log(error);
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
      <View style={styles.container}>
        <View style={{ flex: 4, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <Image
            style={styles.imageStyle}
            source={require('./images/logo_transparent.png')}>
          </Image>
          <TextInput
            style={styles.textInput}
            placeholder={"Name"}
            onChangeText={(name) => this.setState({ name })}
            value={this.state.title}
          />
          <TextInput style={styles.textInput}
            placeholder={"Username"}
            onChangeText={(user) => this.setState({ user })}
            value={this.state.user}
          />

          <TextInput style={styles.textInput}
            placeholder={"Password"}
            secureTextEntry={true}
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
          />
          <TouchableOpacity
            style={styles.button}
            //onPress={this.registerUser}
            >

            <Text style={styles.buttonText}>
              Register
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{backgroundColor: "#065471", marginTop: 20}}
            //onPress={this.registerUser}
            >

            <Text style={styles.textoLogin}>
              ¿Ya tienes cuenta?
            </Text>
          </TouchableOpacity>
        </View>
        
      </View>
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

  textInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    width: 250,
    margin: 3,
    fontSize: 16,
    backgroundColor: "white",
    padding: 10
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
    width: 350,
    height: 350,
    alignSelf: 'center'
  }
});