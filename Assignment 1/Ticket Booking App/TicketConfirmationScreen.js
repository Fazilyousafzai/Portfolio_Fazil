import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const TicketConfirmationScreen = ({ route, navigation }) => {
  // Get the selected seat from route params
  const { seatNumber } = route.params || {};

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Flight E-Ticket</Text>

      {/* Ticket Box */}
      <View style={styles.ticketBox}>
        <View style={styles.routeContainer}>
          <Text style={styles.airportCode}>Lah</Text>
          <Text style={styles.planeIcon}>✈️</Text>
          <Text style={styles.airportCode}>ISB</Text>
        </View>

        {/* Passenger Info */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.label}>Flight Class</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.value}>Fazil Yousafzai</Text>
          <Text style={styles.value}>Economy</Text>
        </View>

        {/* Departure & Arrival */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Depart Date</Text>
          <Text style={styles.label}>Depart Time</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.value}>10 March, 2025</Text>
          <Text style={styles.value}>10:00 AM</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Arrival Date</Text>
          <Text style={styles.label}>Arrival Time</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.value}>11 March, 2025</Text>
          <Text style={styles.value}>2:00 AM</Text>
        </View>

        {/* Flight ID, Seat, and Gate */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>ID Flight</Text>
          <Text style={styles.label}>Seat</Text>
          <Text style={styles.label}>Gate</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.value}>890T8912</Text>
          <Text style={styles.value}>{seatNumber || "N/A"}</Text>
          <Text style={styles.value}>B10</Text>
        </View>
      </View>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        const qrCodeImage = require("../assets/qrcode.jpg");
        <Text style={styles.downloadText}>Download tickets here 🔄</Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  ticketBox: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  routeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  airportCode: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563EB",
  },
  planeIcon: {
    fontSize: 18,
    color: "#888",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: {
    fontSize: 12,
    color: "#888",
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
  },
  qrContainer: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  qrImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  downloadText: {
    marginTop: 10,
    color: "#2563EB",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TicketConfirmationScreen;
