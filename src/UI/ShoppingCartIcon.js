import React from 'react';
import { Text, View, Image, StyleSheet, PixelRatio } from 'react-native';
//import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
const Cart = require('../assets/images/global/cart.png');
import Cons from '../../src/shared/Constants';

// Font size management
let FONT_SIZE = 16;
if (PixelRatio.getFontScale() > 1) FONT_SIZE = 12;

const shoppingCartIcon = () => {

    const cartItems = useSelector(state => state.order.items);

    return (
        <View>
            <Image
                style={styles.cartIcon}
                source={Cart}
            />

            <View style={ (cartItems.length < 10) ? styles.cartContainerLowerNumber : styles.cartContainerHigherNumber }>
                <Text style={styles.chartText}> {cartItems.length} </Text>
             </View >
        </View>
    );
};

const styles = StyleSheet.create({
    cartIcon: {
        height: 40,
        width: 40,
    },
    cartContainerLowerNumber: {
        position: 'absolute',
        height: 30,
        width: 30,
        right: -2.5,
        bottom: 12,
    },
    cartContainerHigherNumber: {
        position: 'absolute',
        height: 30,
        width: 30,
        right: 2,
        bottom: 12,
    },
    chartText: {
        color: Cons.COLORS.BLACK,
        fontSize: FONT_SIZE,
    }

});

export default shoppingCartIcon;