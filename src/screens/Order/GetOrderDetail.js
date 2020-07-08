import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Spinner,
    Grid,
    Col,
    Button,
    Icon,
    Container,
    Toast,
    ListItem,
    Right,
    Body
} from "native-base";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { httpUrl } from '../../../urlServer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';


const getOrderDetail = (props) => {

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState([]);
    const user = useSelector(state => state.user);

    useEffect(() => {
        startFunctions()
            .catch(error => {
                console.warn(JSON.stringify(error));
            });
    }, []);

    const startFunctions = async () => {
        try {
            let order_id = props.navigation.getParam('order');
            await getOrder(user.id, order_id, user.token);
            setLoading(false);
        } catch (error) {
            throw error;
        }
    };

    const getOrder = async (user_id, order_id, token) => {
        axios.get(`${httpUrl}/order/get/item/user`, {
            params: {
                user_id: user_id,
                order_id: order_id,
            },
            headers: { authorization: token }
        }).then(async res => {
            if (res.status === 200 || res.status === 304) {
                let order = res.data;
                setOrder(ordr => [...ordr, ...order]);
                setLoading(false);
            } else {
                showToast("Ha ocurrido un error")
            }
        }).catch(async err => {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                showToast("Por favor, vuelve a entrar")
                await AsyncStorage.clear();
                props.navigation.navigate('StartScreen');
            } else if (err.response && err.response.status === 400) {
                showToast("Ha ocurrido un error")
            } else {
                showToast("Ups... parece que no hay conexión")
            }
            setLoading(false);
        });
    };

    const cancelOrder = async () => {
        Alert.alert(
            "Estas seguro que quieres cancelar el pedido?",
            null,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        axios.post(`${httpUrl}/order/cancelOrderUser`, {
                            order_id: order[0].order_id,
                            pharmacy_id: order[0].pharmacy_id,
                            user_id: order[0].user_id
                        }, {
                            headers: { authorization: user.token }
                        }).then(async res => {
                            if (res.status === 200 && res.data.order) {
                                let ordr = res.data.order;
                                setOrder(ordr);
                            } else {
                                { showToast("Ha ocurrido un error") }
                            }
                        }).catch(async err => {
                            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                                { showToast("Por favor, vuelve a entrar") }
                                await AsyncStorage.clear();
                                props.navigation.navigate('StartScreen');
                            } else if (err.response && err.response.status === 400) {
                                { showToast("Ha ocurrido un error") }
                            } else {
                                { showToast("Ups... parece que no hay conexión") }
                            }
                        });
                    }
                }
            ],
            { cancelable: false }
        );
    };

    // const acceptPriceOrder = async () => {
    //     Alert.alert(
    //         "¿Estás seguro que quieres aceptar el siguiente precio?",
    //         order[0].total_price + ' €',
    //         [
    //             {
    //                 text: "Cancel",
    //                 onPress: () => console.log("Cancel Pressed"),
    //                 style: "cancel"
    //             },
    //             {
    //                 text: "OK", onPress: () => {
    //                     axios.post(`${httpUrl}/order/acceptPriceOrder`, {
    //                         order_id: order[0].order_id,
    //                         user_id: order[0].user_id
    //                     }, {
    //                         headers: { authorization: user.token }
    //                     }).then(async res => {
    //                         if (res.status === 200 && res.data.order) {
    //                             let ordr = res.data.order;
    //                             setOrder(ordr);
    //                         } else {
    //                             { showToast("Ha ocurrido un error") }
    //                         }
    //                     }).catch(async err => {
    //                         if (err.response && (err.response.status === 401 || err.response.status === 403)) {
    //                             { showToast("Por favor, vuelve a entrar") }
    //                             await AsyncStorage.clear();
    //                             props.navigation.navigate('StartScreen');
    //                         } else if (err.response && err.response.status === 400) {
    //                             { showToast("Ha ocurrido un error") }
    //                         } else {
    //                             { showToast("Ups... parece que no hay conexión") }
    //                         }
    //                     });
    //                 }
    //             }
    //         ],
    //         { cancelable: false }
    //     );
    // };

    const showToast = (text) => {
        Toast.show({
            text: text,
            position: "bottom",
            buttonText: "Okay"
        });
    };

    const RenderDate = ({ date }) => {
        return (
            <Text note style={{ marginLeft: 5 }}>
                {("0" + date.getHours()).slice(-2)}:{("0" + date.getMinutes()).slice(-2)} {("0" + date.getDate()).slice(-2)}/{("0" + (date.getMonth() + 1).toString()).slice(-2)}/{(date.getFullYear())}
            </Text>
        )
    };

    const StatusOrder = ({ status }) => {
        if (status === 0) {
            return (<Text style={styles.statusGrey}>DRAFT</Text>)
        } else if (status === 1) {
            return (<Text style={styles.statusGrey}>REQUESTED</Text>)
        } else if (status === 2) {
            return (<Text style={styles.statusYellow}>CONFIRMED</Text>)
        } else if (status === 3) {
            return (<Text style={styles.statusGrey}>PICK UP READY</Text>)
        } else if (status === 4) {
            return (<Text style={styles.statusYellow}>IN TRANSIT</Text>)
        } else if (status === 5) {
            return (<Text style={styles.statusGreen}>DELIVERED</Text>)
        } else if (status === 6) {
            return (<Text style={styles.statusRed}>CANCELLED</Text>)
        } else {
            return (<Text />)
        }
    };

    const renderItem = ({ item, index }) => {
    console.log(' -- ', item);
        item.screen = 'GetOrderDetail'
        return (
            <ListItem
                id={item.order_item}
                onPress={() => props.navigation.navigate('ProductDetail', item)}
                bottomDivider
                chevron
                >
                <View>
                    <Text style={styles.subtitleText}>Item {index}: </Text>
                    <Text>{item.product_desc}</Text>
                    <Text style={styles.subtitleText}>{item.price} € </Text>
                </View>
            </ListItem>
            //}
            //onPress={() => props.navigation.navigate('OrderItem', item)}
            //bottomDivider
            //chevron />
        )
    };

    const RenderList = () => {
        return (
            <FlatList
                data={order}
                renderItem={renderItem}
                keyExtractor={item => item.order_item.toString()}>
            </FlatList>
        );
    };

    const openImage = (item) => {
        props.navigation.navigate('FullScreenImage', {
            order: item
        });
    };

    const openTrace = (item) => {
        props.navigation.navigate('OrderTrace', {
            order_id: item
        });
    }

    const RenderPage = () => (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}> Order </Text>
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Reference: </Text>
                    <Text style={styles.rowValue}> #{order[0].order_id_app} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Pharmacy: </Text>
                    <Text style={styles.rowValue}> {order[0].pharmacy_desc} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Status: </Text>
                    <Text style={styles.rowValue}> <StatusOrder status={order[0].status} /> </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Price: </Text>
                    {/* {(order[0].total_price)
                        ? <Text style={styles.rowValue}> {order[0].total_price} € </Text>
                        : <Text style={styles.rowValue}> Pending </Text>} */}
                    <Text style={styles.rowValue}> {order[0].total_price} € </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Trace: </Text>
                    <Ionicons
                        name='ios-checkmark-circle-outline'
                        size={20}
                        color='green'
                    />
                    <TouchableOpacity
                        style={styles.button2}
                        onPress={() => openTrace(order[0].order_id)}
                    >
                        <Text style={[styles.rowValue, styles.buttonText]}> Details </Text>
                    </TouchableOpacity>
                </View>
                <RenderList />
            </View>
            {(order[0].status === 1 || order[0].status === 2)
                ? <View>
                    <Grid>
                        <Col size={1} />
                        <Col size={2} style={styles.colButton}>
                            <Button block bordered rounded danger
                                style={styles.buttonCanceled}
                                onPress={cancelOrder}>
                                <Text numberOfLines={1}>
                                    Cancel Order
                                </Text>
                            </Button>
                        </Col>
                        <Col size={1} />
                    </Grid>
                </View>
                : null
            }
        </View>
    );

    return (
        <Container>
            <CustomHeaderBack {...props} />
            {(loading || !order[0]) ?
                <Spinner color='#F4B13E' /> :
                <RenderPage />
            }
        </Container>
    )
};

const styles = StyleSheet.create({
    headerContainer: {
        margin: 15,
        borderBottomWidth: 0.3,
        borderColor: 'orange',
    },
    rowContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    rowHeader: {
        color: 'grey',
        width: 110,
        fontSize: 16,
    },
    rowValue: {
        fontSize: 16,
    },
    sectionContainer: {
        marginLeft: 25,
        marginTop: 5,
    },
    titleText: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    buttonText: {
        color: 'white'
    },
    button2: {
        backgroundColor: '#00A591',
        marginLeft: 10,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 15,
    },
    button: {
        backgroundColor: '#F4B13E'
    },
    startCols: {
        justifyContent: 'center'
    },
    infoCols: {
        justifyContent: 'center',
        textAlign: 'center'
    },
    status: {
        alignItems: 'center',
        fontSize: 20
    },
    content: {
        flex: 0.2,
        flexDirection: 'column'
    },
    smallFont: {
        fontSize: 12,
        textAlign: 'center'
    },
    colButton: {
        paddingHorizontal: '2%',
        marginTop: '2%'
    },
    buttonCanceled: {
        marginTop: '2%'
    },
    buttonDelivered: {
        marginTop: '2%'
    },
    statusGrey: {
        color: 'grey',
        fontSize: 16,
    },
    statusYellow: {
        color: '#f0ad4e',
        fontSize: 16,
    },
    statusGreen: {
        color: '#5cb85c',
        fontSize: 16,
    },
    statusRed: {
        color: '#d9534f',
        fontSize: 16,
    },
    subtitleText: {
        color: 'grey',
        fontSize: 16,
    }
});

export default getOrderDetail;