import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TicketScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Flights</Text>

      <TouchableOpacity style={styles.flightCard} onPress={() => navigation.navigate("SeatSelectionScreen")}>
        <Text style={styles.flightText}>Islamabad → Lahore</Text>
        <Text style={styles.time}>10:00 PM - 2:00 AM</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  flightCard: { backgroundColor: "#2563EB", padding: 15, borderRadius: 10, alignItems: "center" },
  flightText: { color: "white", fontSize: 18, fontWeight: "bold" },
  time: { color: "white", fontSize: 14, marginTop: 5 },
});

export default TicketScreen;
