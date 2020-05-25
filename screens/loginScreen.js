import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, SafeAreaView, ScrollView } from 'react-native';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'; 
import config from '../config';

async function GetUser(userName, password) {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept-Language", "es");
  
  let resultado = await fetch(config.endpoint+"Login?userName="+
      encodeURIComponent(userName)+"&password="+encodeURIComponent(password));
  
  let json = await resultado.json();
  if (json.error) {
    throw new Error(json.error);
  }
  return json;
}

export default class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
    }
    this.idSerie = 121361;
  }

  /*login = () => {
    this.props.navigation.navigate('Serie', {idSerie: this.idSerie});
  }*/

  login = () => {
    GetUser(this.state.userName, this.state.password)
      .then(response => {
        AsyncStorage.setItem("token", response.token)
        .then(() => {
          this.setState({
            userName: "",
            password: "",
          })
          this.props.navigation.navigate('Inicio');
        });
      })
      .catch(error => {
        ToastAndroid.showWithGravity(error.message, ToastAndroid.LONG, ToastAndroid.TOP);
      });
  }

  register = () => {
    this.props.navigation.navigate('Register');
  }

render() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{width:"100%"}}>
        <View style={styles.container}>
            <Image
              style={styles.imageStyle}
              source={require('../images/logo_transparent.png')}>
            </Image>

            <TextInput
              style={styles.textInput}
              placeholder={"User"}
              onChangeText={(userName) => this.setState({userName})}
              value={this.state.userName}
            />

            <TextInput
              style={styles.textInput}
              placeholder={"Password"}
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={this.login}>
              <Text style={styles.buttonText}>
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button_register}
              onPress={this.register}>

              <Text style={styles.buttonText_register}>
                o regístrate
              </Text>
            </TouchableOpacity>
        </View>
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
    backgroundColor: "#065471",
    paddingBottom: 20,
    alignContent: 'center'
  },

  button: {
    width: 275,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 7,
    borderRadius: 10,
    backgroundColor: "#ffc045",
  },

  button_register: {
    width: 275,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 7,
    borderRadius: 10,
    backgroundColor: "#f7c873"
  },

  button_invitado: {
    width: 275,
    paddingTop: 8,
    paddingBottom: 8,
    borderRightWidth: 5,
    borderLeftWidth: 5,
    borderRightColor: '#dba470',
    borderLeftColor: '#dba470',
    marginTop: 7,
    borderRadius: 10,
    backgroundColor: "#f6e8cb",
  },

  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold'
  },

  buttonText_register: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold'
  },


  textInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    width: 250,
    fontSize: 16,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 5,
    padding: 10

  },
  imageStyle: {
    width: 120,
    height: 177,
    alignSelf: 'center',
    marginVertical: 80
  }
});