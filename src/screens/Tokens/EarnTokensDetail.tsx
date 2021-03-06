import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import moment from 'moment';
import Cons from '../../shared/Constants';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TokenStackParamList } from '../../navigation/StackNavigator';
import CheckBox from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    route: RouteProp<TokenStackParamList, 'EarnTokensDetail'>,
    navigation: StackNavigationProp<TokenStackParamList, 'EarnTokensDetail'>
};

const EarnTokensDetail = (props: Props) => {
    const {
        earn_desc,
        earn_desc_long,
        earn_qty,
        supplier_desc,
        validity_end_date,
        validity_start_date} = props.route.params;

    const [isLegalAccepted, setIsLegalAccepted] = useState(false);

    const renderDate = (startDate: Date, endDate: Date) => {
        const start = moment(startDate).format('Do MMMM YY');
        const end = moment(endDate).format('Do MMMM YY');
        return `${start}  -  ${end}`;
    };

    const renderDescription = () => (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{earn_desc}</Text>
                <Text style={styles.subHeaderText}>Sponsored by {supplier_desc}</Text>
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Summary: </Text>
                <Text style={styles.sectionValue}>{(earn_desc_long) ? earn_desc_long : 'No description provided'}</Text>
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Period: </Text>
                <Text style={styles.sectionValue}>
                    {renderDate(validity_start_date, validity_end_date)}
                </Text>
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Your data to be shared: </Text>
                <Text style={styles.sectionValue}>
                    Age, Gender, Location, Medicines consumed
                </Text>
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Reward: </Text>
                <Text style={[styles.sectionValue, styles.bold]}>{earn_qty} PCT</Text>
            </View>
        </View>
    );

    const renderLegalTerms = () => (
        <View>
            <View style={styles.legalContainer}>
                <TouchableOpacity onPress={() => setIsLegalAccepted(!isLegalAccepted)}>
                    <CheckBox
                        name={(isLegalAccepted) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        size={30} />
                </TouchableOpacity>
                <Text style={styles.text}> I accept the </Text>
                <TouchableOpacity
                //onPress={}  TBD
                >
                    <Text style={styles.legalText}>terms and legal conditions </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderConfirm = () => (
        <View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleConfirm()}>
                    <Text style={styles.buttonText}> CONFIRM </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const handleConfirm = () => {
        if (!isLegalAccepted) {
            Alert.alert('Please accept the terms and legal conditions to move forward');
        } else {
            console.log('Confirmed!');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {renderDescription()}
                {renderLegalTerms()}
                {renderConfirm()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    headerContainer: {
        alignItems: 'center',
        margin: 20,
    },
    headerText: {
        fontSize: 22,
    },
    subHeaderText: {
        fontSize: 17,
        marginTop: 10,
        fontWeight: '200',
    },
    sectionContainer: {
        marginLeft: 15,
    },
    sectionTitle: {
        color: 'grey',
        fontSize: 18,
        marginBottom: 5,
    },
    sectionValue: {
        fontSize: 16,
        marginBottom: 20,
    },
    legalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15,
    },
    text: {
        fontSize: 16,
    },
    bold: {
        fontWeight: 'bold',
    },
    legalText: {
        fontSize: 16,
        color: Cons.COLORS.BLUE,
    },
    buttonContainer: {
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        alignItems: 'center',
        fontWeight: '600',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00A591',
        marginTop: 35,
        width: 150,
        height: 50,
        borderRadius: 10,
    },
});

export default EarnTokensDetail;
