import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Platform,
    StyleSheet,
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { httpUrl } from '../../../urlServer';
import ActivityIndicator from '../../UI/ActivityIndicator';
import { ListItem, SearchBar } from 'react-native-elements';
import handleAxiosErrors from '../../shared/handleAxiosErrors';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';


const makeOrderChoose = (props) => {

    const user = useSelector(state => state.user);
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [typingTimeout, setIsTypingTimeout] = useState(0);
    const [isLoading, setIsLoding] = useState(false);
    const TIMER = 500;
    const MIN_CHARACTERS = 3;

    // Launch product query 800ms after typing the search string
    useEffect(() => {
        if (typingTimeout) clearTimeout(typingTimeout);
        setIsTypingTimeout(setTimeout(() => {
            if (search && search.length >= MIN_CHARACTERS) fetchProducts();
        }, TIMER))
    }, [search]);

    // Update search string
    const updateSearch = search => {
        setSearch(search);
    };

    // On cancel search, remove product list
    const cancelSearch = () => {
        setProducts([]);
    }

    // Show list of Products found
    const renderProduct = (values) => {
        values.item.screen = 'MakeOrderChoose';
        return (
            <ListItem
                title={values.item.product_desc}
                subtitle={
                    <View>
                        <Text style={styles.subtitleText}>{values.item.price} € </Text>
                    </View>
                }
                onPress={() => props.navigation.navigate('ProductDetail', values.item)}
                bottomDivider
                chevron />
        )
    };

    // Product query in the DB
    const fetchProducts = async () => {
        setIsLoding(true);
        await axios.get(`${httpUrl}/product/get`, {
            params: { searchCriteria: search.toUpperCase() },
            headers: { authorization: user.token }
        })
            .then(response => {
                if (response.data !== '') setProducts(response.data);
            })
            .catch(async err => {
                handleAxiosErrors(props, err);
                console.log('Error on MakeOrderChoose.js -> fetchProducts() : ', err);
            })
            .then(() => {
                setIsLoding(false);
            })
    };

    return (
        <View style={styles.container}>
            <CustomHeaderBack {...props} />
            <SearchBar
                placeholder="Product name, national code"
                onChangeText={updateSearch}
                onCancel={cancelSearch}
                onClear={cancelSearch}
                value={search}
                autoCapitalize='none'
                autoCorrect={false}
                maxLength={100}
                containerStyle={styles.button}
                platform={Platform.OS == 'ios' ? 'ios' : 'android'} />
            <FlatList
                data={products}
                keyExtractor={(item) => item.product_id.toString()}
                renderItem={renderProduct} />
            <View>
                <ActivityIndicator isLoading={isLoading} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    itemContainer: {
        marginTop: 60,
        alignItems: 'center',
    },
    button: {
        marginTop: 10,
        backgroundColor: 'white',
    },
    subtitleText: {
        color: 'grey',
        fontSize: 16,
    }
})

export default makeOrderChoose;