import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const SeatSelectionScreen = ({ navigation }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);

  const seats = [
    { id: 1, type: "booked" },
    { id: 2, type: "available" },
    { id: 3, type: "available" },
    { id: 4, type: "available" },
    { id: 5, type: "booked" },
    { id: 6, type: "booked" },
    { id: 7, type: "booked" },
    { id: 8, type: "available" },
    { id: 9, type: "booked" },
    { id: 10, type: "available" },
    { id: 11, type: "available" },
    { id: 12, type: "booked" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Seat</Text>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: "#D1D5DB" }]} />
          <Text>Booked</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: "#2563EB" }]} />
          <Text>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: "#FF8C42" }]} />
          <Text>You</Text>
        </View>
      </View>

      <View style={styles.seatContainer}>
        {seats.map((seat) => (
          <TouchableOpacity
            key={seat.id}
            style={[
              styles.seat,
              seat.type === "booked" && styles.bookedSeat,
              seat.type === "available" && styles.availableSeat,
              selectedSeat === seat.id && styles.selectedSeat,
            ]}
            disabled={seat.type === "booked"}
            onPress={() => setSelectedSeat(seat.id)}
          >
            <Text style={styles.seatText}>{seat.id}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedSeat && (
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={() => navigation.navigate("TicketConfirmation", { seatNumber: selectedSeat })}
        >
          <Text style={styles.confirmText}>Confirm Seat {selectedSeat}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendBox: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 5,
  },
  seatContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  seat: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 10,
  },
  bookedSeat: {
    backgroundColor: "#D1D5DB",
  },
  availableSeat: {
    backgroundColor: "#2563EB",
  },
  selectedSeat: {
    backgroundColor: "#FF8C42",
  },
  seatText: {
    color: "white",
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#FF8C42",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  confirmText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SeatSelectionScreen;
