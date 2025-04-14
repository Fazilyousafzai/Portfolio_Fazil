import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import TicketScreen from "./TicketScreen";
import SeatSelectionScreen from "./SeatSelectionScreen";
import TicketConfirmationScreen from "./TicketConfirmationScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TicketScreen" component={TicketScreen} />
        <Stack.Screen name="SeatSelectionScreen" component={SeatSelectionScreen} />
        <Stack.Screen name="TicketConfirmation" component={TicketConfirmationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
