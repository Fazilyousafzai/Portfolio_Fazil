// App.js - Main Navigation Component
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import DashboardScreen from './screens/DashboardScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import ReportsScreen from './screens/ReportsScreen';
import CategoryDetailScreen from './screens/CategoryDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Sample initial data
const initialTransactions = [
  { id: '1', type: 'income', amount: 3000, category: 'Salary', date: '2025-03-01', note: 'Monthly salary' },
  { id: '2', type: 'expense', amount: 50, category: 'Food', date: '2025-03-05', note: 'Groceries' },
  { id: '3', type: 'expense', amount: 25, category: 'Transportation', date: '2025-03-07', note: 'Uber ride' },
  { id: '4', type: 'expense', amount: 120, category: 'Utilities', date: '2025-03-10', note: 'Electricity bill' },
  { id: '5', type: 'expense', amount: 35, category: 'Entertainment', date: '2025-03-12', note: 'Movie tickets' }
];

// Main tab navigation
const TabNavigator = ({ transactions, addTransaction }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Dashboard">
        {props => <DashboardScreen {...props} transactions={transactions} />}
      </Tab.Screen>
      <Tab.Screen name="Add">
        {props => <AddExpenseScreen {...props} addTransaction={addTransaction} />}
      </Tab.Screen>
      <Tab.Screen name="Reports">
        {props => <ReportsScreen {...props} transactions={transactions} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Main stack navigation to include detailed screens
const MainNavigator = () => {
  const [transactions, setTransactions] = useState(initialTransactions);

  // Load transactions from storage on app start
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem('transactions');
        if (storedTransactions !== null) {
          setTransactions(JSON.parse(storedTransactions));
        }
      } catch (error) {
        console.log('Error loading transactions:', error);
      }
    };
    
    loadTransactions();
  }, []);

  // Save transactions to storage whenever they change
  useEffect(() => {
    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
      } catch (error) {
        console.log('Error saving transactions:', error);
      }
    };
    
    saveTransactions();
  }, [transactions]);

  const addTransaction = (newTransaction) => {
    const transactionWithId = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setTransactions([...transactions, transactionWithId]);
  };

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        options={{ headerShown: false }}>
        {props => <TabNavigator {...props} transactions={transactions} addTransaction={addTransaction} />}
      </Stack.Screen>
      <Stack.Screen 
        name="CategoryDetail" 
        component={CategoryDetailScreen} 
        options={({ route }) => ({ title: route.params.category })} 
      />
    </Stack.Navigator>
  );
};

// This is the main App component
export default function App() {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}