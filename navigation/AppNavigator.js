import React from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import AuthLoading from '../screens/auth/AuthLoading';
import Login from '../screens/auth/Login';
import Signup from '../screens/auth/Signup';

const LoginStack = createStackNavigator(
  {
    Login: Login,
    Signup: Signup,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  }
);

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    LoginStack: LoginStack,
    Signup: Signup,
    Main: MainTabNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  });