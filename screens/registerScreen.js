import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image } from 'react-native';
import { ToastAndroid } from 'react-native';
import config from '../config';


async function addUser(name, userName, password) {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept-Language", "es");
  let body = {
    name,
    userName,
    password,
  };
  console.log(body);
  let resultado = await fetch(config.endpoint+"/Usuarios",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    }
  );
  let json = await resultado.json();
  console.log(json);
  if (json.error) {
    throw new Error(json.error);
  }
}

export default class RegisterScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      user: "",
      password: "",
    }
  }

  registerUser = () => {
    addUser(this.state.name, this.state.user, this.state.password)
    .then(response => {
      ToastAndroid.showWithGravity('Usuario registrado correctamente', ToastAndroid.LONG, ToastAndroid.TOP);
      this.props.navigation.navigate("Login");
    }).catch(error => {
      ToastAndroid.showWithGravity(error.message, ToastAndroid.LONG, ToastAndroid.TOP);
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ width: "100%" }}>
          <View style={styles.container}>
            <Image
              style={styles.imageStyle}
              source={require('../images/logo_transparent.png')}>
            </Image>
            <TextInput
              style={styles.textInput}
              placeholder={"Name"}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
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
              onPress={this.registerUser}
            >

              <Text style={styles.buttonText}>
                Register
            </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: "#065471", marginTop: 20 }}
              onPress={this.props.navigation.goBack}
            >

              <Text style={styles.textoLogin}>
                ¿Ya tienes cuenta?
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
    backgroundColor: '#065471',
    alignContent: 'center',
    paddingBottom: 20,
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
    width: 120,
    height: 177,
    alignSelf: 'center',
    marginVertical: 80
  }
});