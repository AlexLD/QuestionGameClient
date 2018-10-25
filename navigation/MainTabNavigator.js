import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

import GameScreen from '../screens/GamePlay/GameScreen';
import StartGame from '../screens/GamePlay/StartGame';
import JoinGame from '../screens/GamePlay/JoinGame';
import PlayersScreen from '../screens/GamePlay/PlayersScreen';

import GameListScreen from '../screens/GameAdmin/GameListScreen';
import QuestionEditScreen from '../screens/GameAdmin/QuestionEditScreen';
import QuestionListScreen from '../screens/GameAdmin/QuestionListScreen';

const GamePlayStack = createStackNavigator(
  {
    Game: GameScreen,
    StartGame: StartGame,
    JoinGame: JoinGame,
    PlayersScreen: PlayersScreen,
  },{
    headerMode:'none'
  }
);

GamePlayStack.navigationOptions = {
  tabBarLabel: 'Game',
  tabBarIcon: ({focused})=>(
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
        ? `ios-game-controller-a${focused ? '' : '-outline'}`
        : 'md-game-controller-a'
      }
    />
  )
};

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const GameAdminStack = createStackNavigator(
  {
    GameList: GameListScreen,
    QuestionEdit: QuestionEditScreen,
    QuestionList: QuestionListScreen,
  },
  {
    initialRouteKey:'GameList',
    headerMode: 'none'
  }
);

GameAdminStack.navigationOptions = {
  tabBarLabel: 'Admin',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  GamePlayStack,
  HomeStack,
  GameAdminStack,
  SettingsStack,
});
