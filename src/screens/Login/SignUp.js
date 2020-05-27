import React, { useState } from 'react';
import {
    View,
    Alert,
    Image,
    Linking,
    Platform,
    StyleSheet,
    ImageBackground, 
    KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { 
    Button, 
    Text, 
    Container, 
    Content, 
    Form, 
    Item, 
    Input, 
    Toast, 
    Spinner } from "native-base";
import axios from 'axios';
import Cons from '../../shared/Constants';
import CheckBox from 'react-native-vector-icons/MaterialCommunityIcons';
import { httpUrl } from '../../../urlServer';
import { TouchableOpacity } from 'react-native-gesture-handler';

const image = require('../../assets/images/global/DrMax.png');
const backgroundImage = require('../../assets/images/global/background.jpg');

const lockGrey = require('../../assets/images/login/lock.png');
const phoneGrey = require('../../assets/images/login/phone.png');
const userGrey = require('../../assets/images/login/user.png');
const emailGrey = require('../../assets/images/login/email.png');

const signup = ( props ) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLegalAccepted, setIsLegalAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
    phone: ''
  });
  const updateField = (key, value) => {
    setUser({
      ...user,
      [key]: value
    });
  };

  const showToast = (text) => {
    Toast.show({
      text: text,
      position: "bottom",
    });
  };

  const toggleIsLegalAccepted = () => {
    const prev = isLegalAccepted;
    setIsLegalAccepted(!isLegalAccepted);
  }

  const legalAlert = () => {
      Alert.alert('Por favor, marca la casilla de términos y condiciones legales');
  }

    // Opens a URL in the browser
  const handleURL = () => {
    const url = 'https://www.doctormax.es/privacidad-y-condiciones-de-uso/'
    Linking.canOpenURL(url)
        .then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert(`No se puede abrir el navegador`);
            }
        })
        .catch(err => {
            Alert.alert('Ha habido un error con el navegador');
            //logger('ERR', 'FRONT-USER', `Profile.js -> handleURL(): ${err}`, user, `email:  ${url}`);
            console.log('Error on Pharmacy.js -> handleURL(): ', err);
    })
  };

/* TODO: Show conditions in Modal instead of opening browser, in order to reduce risk
        of not finishing the process by jumping to another app */
//
//   const toggleIsModalOpen = () => {
//     const prev = isModalOpen;
//     setIsModalOpen(!prev);
//   }
//   const renderConsent = () => (
//     <Modal 
//         visible={isModalOpen}
//         transparent={true}
//         animationType='slide'
//     >
//         {/* <View style={styles.centeredView}> */}
//             {/* <View style={styles.modalView}> */}
//             <View style={styles.containerModal}>
//                 <Text>
//                     Hallo!
//                 </Text>
//                 <TouchableOpacity
//                     onPress={() => toggleIsModalOpen()}
//                 >
//                     <Text> Close </Text>
//                 </TouchableOpacity>
//             </View>
//         {/* </View> */}
//     </Modal>
//   )

  const register = () => {
    console.log('credentials:', user.email, user.password, user.name, user.phone);
    if(user.email && user.password) {
      if(user.password === user.repeatPassword) {
        setLoading(true);
        axios.post(`${httpUrl}/users/register`, {
          name: user.name,
          email: user.email,
          password: user.password,
          phone: user.phone
        }).then(async res => {
          if(res.status === 200 && res.data.token) {
            await AsyncStorage.clear();
            await AsyncStorage.setItem('token', JSON.stringify(res.data.token));
            await AsyncStorage.setItem('user', JSON.stringify(res.data));
            console.log('** USER SignUp: ', res.data);
            setLoading(false);
            props.navigation.navigate('Main');
          } else {
            {showToast("Ha ocurrido un error")}
            setLoading(false);
          }
        }).catch((err) => {
          if(err.response && err.response.status === 400) {
            {showToast("Error al crear usuario, prueba en unos instantes")}
          } else if(err.response && err.response.status === 404) {
            {showToast("Ya existe una cuenta con este email")}
          } else {
            {showToast("Ups... parece que no hay conexión")}
          }
          setLoading(false);
        });
      } else {
        {showToast("Las contraseñas no coinciden")}
      }
    } else {
      {showToast("Por favor, completa todos los campos")}
    }
  };

  return (
    <Container style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={backgroundImage}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS == "ios" ? -30 : 500}
          style={styles.containerKeyboard}>
        <Image
          style={styles.logo}
          source={image}
        />
        {(loading) ?
          <Content style={styles.content}>
            <Spinner color='#F4B13E' />
          </Content>
        : (
          <Content style={styles.content}>
            <Form style={styles.form}>
              <Item rounded
                    style={styles.input}>
                <Image
                  style={styles.iconInput}
                  source={userGrey}/>
                <Input type="text"
                       placeholder="Nombre"
                       maxLength={254}
                       onChangeText={(name) => updateField('name', name)}
                       value={user.name}/>
              </Item>
              <Item rounded
                    style={styles.input}>
                <Image
                  style={styles.iconInput}
                  source={emailGrey}/>
                <Input type="text"
                       autoCapitalize='none'
                       placeholder="Email"
                       keyboardType="email-address"
                       maxLength={254}
                       onChangeText={(mail) => updateField('email', mail)}
                       value={user.email}/>
              </Item>
              <Item rounded
                    style={styles.input}>
                <Image
                  style={styles.iconInput}
                  source={phoneGrey}/>
                <Input type="number"
                       maxLength={20}
                       placeholder="Telefono"
                       keyboardType="phone-pad"
                       onChangeText={(phone) => updateField('phone', phone)}
                       value={user.phone}/>
              </Item>
              <Item rounded
                    style={styles.input}>
                <Image
                  style={styles.iconInput}
                  source={lockGrey}/>
                <Input autoCapitalize='none'
                       secureTextEntry={true}
                       type="text"
                       maxLength={254}
                       placeholder="Contraseña"
                       onChangeText={(pass) => updateField('password', pass)}
                       value={user.password}/>
              </Item>
              <Item rounded
                    style={styles.input}>
                <Image
                  style={styles.iconInput}
                  source={lockGrey}/>
                <Input autoCapitalize='none'
                       secureTextEntry={true}
                       type="text"
                       maxLength={254}
                       placeholder="Repetir Contraseña"
                       onChangeText={(repeatPass) => updateField('repeatPassword', repeatPass)}
                       value={user.repeatPassword}/>
              </Item>
              <View style={[styles.text, styles.containerCheckBox]}>
                  <TouchableOpacity onPress={toggleIsLegalAccepted}>
                    <CheckBox 
                        name={(isLegalAccepted) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        size={30}
                    />
                  </TouchableOpacity>
                  <Text> Acepto los </Text>
                  <TouchableOpacity onPress={handleURL}>
                    <Text style={styles.textLegal}>términos y condiciones legales </Text>
                  </TouchableOpacity>
              </View>
              <Button block rounded
                      style={styles.button}
                    //   onPress={register}>
                      onPress={(isLegalAccepted) ? register : legalAlert}>
                <Text>Registrarme</Text>
              </Button>
            </Form>
            <Text style={styles.text}>
              <Text>¿Tienes cuenta? </Text>
              <Text style={styles.bold}
                    onPress={() => props.navigation.navigate('StartScreen')}>
                Accede
              </Text>
            </Text>
          </Content>
        )}
        </KeyboardAvoidingView>
      </ImageBackground>
    </Container>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center'
  },
  containerKeyboard: {
    flex: 1,
    alignItems: 'center'
  },
  iconInput: {
    width: 25,
    height: 25,
    marginLeft: 10
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: 'center'
  },
  logo: {
    resizeMode: 'contain',
    height: 180,
    width: 300,
  },
  text: {
    marginTop: '2%',
    textAlign: 'center'
  },
  input: {
    color: 'white',
    backgroundColor: 'white',
    marginBottom: '2%',
    width: 300
  },
  form: {
    padding: '4%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginTop: '7%',
    marginHorizontal: '30%',
    backgroundColor: '#F4B13E'
  },
  bold: {
    fontWeight: 'bold'
  },
    // containerModal: {
    //     flex: 1,
    //     marginTop: 120,
    //     //borderRadius: 5,
    //     paddingBottom: 100,
    //     backgroundColor: "white",
    //     borderRadius: 20,
    //     shadowColor: "#000",
    //     shadowOffset: {
    //     width: 0,
    //     height: 2
    //     },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 3.84,
    //     },
    containerCheckBox: {
        flex: 1,
        paddingTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textLegal: {
        color: Cons.COLORS.BLUE
    },
});

export default signup;