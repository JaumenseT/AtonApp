import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { ToastAndroid } from 'react-native';

export default class LoginScreen extends Component {

  DB_URL = 'http://localhost:3000';

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      user: "",
      password: ""
    }
  }

  /*login = () => {
    fetch(this.DB_URL + '/usuarios?user=' + this.state.user + '&password=' + this.state.password)
      .then(resp => resp.json())
      .then(data => {
        if (data.length > 0) {
          this.props.navigation.navigate('Home', {user: data[0]});
        } else {
          ToastAndroid.showWithGravity('Usuario o contraseña incorrectos', ToastAndroid.LONG, ToastAndroid.TOP);
        }
      });
  }

register = () => {
  this.props.navigation.navigate('Registro');
}*/

render() {
  return (
    <View style={styles.container}>
      <View style={{ flex: 5, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
        <Image
          style={styles.imageStyle}
          source={require('./images/logo_transparent.png')}>
        </Image>

        <TextInput
          style={styles.textInput}
          placeholder={"User"}
          onChangeText={(user) => this.setState({ user })}
          value={this.state.user}
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
          //onPress={this.login}
        >

          <Text style={styles.buttonText}>
            Entrar
        </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button_register}
          //onPress={this.register}
        >

          <Text style={styles.buttonText_register}>
            o regístrate
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
    backgroundColor: "#065471"
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
    width: 350,
    height: 350,
    marginBottom: 10,
    alignSelf: 'center'
  }
});