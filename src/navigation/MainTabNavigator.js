import React from 'react';
import { Platform, Image, StyleSheet } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Home from '../screens/Home/Home';
import Orders from '../screens/Order/GetOrder';
import OrderDetail from '../screens/Order/GetOrderDetail';

import Profile from '../screens/Profile/Profile';
import CustomHeader from '../navigation/CustomHeader';
import InsideSession from '../screens/Home/InsideSession';

import PharmacySearch from '../screens/Pharmacy/PharmacySearch';
import PharmacyDetails from '../screens/Pharmacy/PharmacyDetail';
import MakeOrder from '../screens/Order/MakeOrder';
import OrderSummary from '../screens/Order/OrderSummary';
import OrderItem from '../screens/Order/MakeOrderDetail';
import FullScreenImage from '../screens/Order/GetOrderImage';
//import Ionicons from 'react-native-vector-icons/Ionicons';

const homeYellow = require('../assets/images/bottomBar/yellow/home.png');
const homeGrey = require('../assets/images/bottomBar/grey/home.png');
const historialYellow = require('../assets/images/bottomBar/yellow/historial.png');
const historialGrey = require('../assets/images/bottomBar/grey/historial.png');
const profileYellow = require('../assets/images/bottomBar/yellow/profile.png');
const profileGrey = require('../assets/images/bottomBar/grey/profile.png');


const HomeStack = createStackNavigator({
    Home: Home,
    PharmacySearch: {
      screen: PharmacySearch,
      navigationOptions: {
        headerShown: false
      }
    },
    PharmacyDetails: {
      screen: PharmacyDetails,
      navigationOptions: {
        headerShown: false
      }
    },
    Order: {
      screen: MakeOrder,
      navigationOptions: {
        headerShown: false
      }
    },
    OrderSummary: {
      screen: OrderSummary,
      navigationOptions: {
        headerShown: false
      }
    },
    OrderItem: {
      screen: OrderItem,
      navigationOptions: {
        headerShown: false
      }
    },
  },
  {
    defaultNavigationOptions: {
      header: props => <CustomHeader {...props} />
    }
  }
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => {
    return focused ?
      <Image
      style={styles.iconHome}
      source={homeYellow}/> :
      <Image
        style={styles.iconHome}
        source={homeGrey}/>
  }
};

const OrdersStack = createStackNavigator({
    Orders: Orders,
    OrderDetail: {
      screen: OrderDetail,
      navigationOptions: {
        headerShown: false
      }
    },
    OrderSummary: {
      screen: OrderSummary,
      navigationOptions: {
        headerShown: false
      }
    },
    FullScreenImage: {
      screen: FullScreenImage,
      navigationOptions: {
        headerShown: false
      }
    }
  },
  {
    defaultNavigationOptions: {
      header: props => <CustomHeader {...props} />
    }
  }
);

OrdersStack.navigationOptions = {
  tabBarLabel: 'Pedidos',
  tabBarIcon: ({ focused }) => {
    return focused ?
      <Image
        style={styles.iconHome}
        source={historialYellow}/> :
      <Image
        style={styles.iconHome}
        source={historialGrey}/>
  }
};

const ProfileStack = createStackNavigator({
    Profile: Profile,
    OrderSummary: {
      screen: OrderSummary,
      navigationOptions: {
        headerShown: false
      }
    },
  },
  {
    defaultNavigationOptions: {
      header: props => <CustomHeader {...props} />
    },
  }
);

ProfileStack.navigationOptions = {
  tabBarLabel: 'Perfil',
  tabBarIcon: ({ focused }) => {
    return focused ?
      <Image
        style={styles.iconHome}
        source={profileYellow}/> :
      <Image
        style={styles.iconHome}
        source={profileGrey}/>
  }
};

const MainTabNavigator = createBottomTabNavigator({
    HomeStack,
    OrdersStack,
    ProfileStack
  },
  {
    defaultNavigationOptions: {
      // header: props => <CustomHeader {...props} />
    },
    tabBarOptions: {
      activeTintColor: '#F4B13E',
      activeBackgroundColor: '#f0f0f0',
      inactiveTintColor: 'black',
      inactiveBackgroundColor: '#F0F0F0',
      style: {
        height: 60,
        backgroundColor: '#F0F0F0',
        paddingBottom: 5
      }
    }
  }
);

const styles = StyleSheet.create({
  iconHome: {
    width: 25,
    height: 25
  }
});

const DrawerNavigator = createStackNavigator({
    Home:{
      screen: MainTabNavigator
    },
    // Cart: Cart,
    InsideSession: InsideSession
  }, {
    initialRouteName: 'InsideSession',
    defaultNavigationOptions: {
      headerShown: false
    }    // contentComponent: props => <SideBar {...props} />,
  }
);

export default StackNavigator = createStackNavigator({
    DrawerNavigator:{
      screen: DrawerNavigator
    }
  },
  {
    defaultNavigationOptions: {
      headerShown: false
    }
  }
);