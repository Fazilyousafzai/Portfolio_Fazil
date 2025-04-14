import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, Fazil</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
        <TextInput placeholder="Find the trip you want" style={styles.searchInput} />
      </View>

      {/* Upcoming Trips - Make it Clickable */}
      <Text style={styles.sectionTitle}>Upcoming Trips</Text>
      <TouchableOpacity onPress={() => navigation.navigate("TicketScreen")}>
        <View style={styles.tripCard}>
          <Text style={styles.tripText}>Islamabad Airport</Text>
          <Text style={styles.time}>10:00 PM</Text>
          <Text style={styles.date}>10 March 2025</Text>
          <Text style={styles.duration}>Duration 04 hours</Text>
          <Text style={styles.tripText}>Lahore Airport</Text>
          <Text style={styles.time}>2:00 AM</Text>
          <Text style={styles.date}>11 March 2025</Text>
        </View>
      </TouchableOpacity>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Category</Text>
      <View style={styles.categoryContainer}>
        <TouchableOpacity style={styles.categoryItem}>
          <FontAwesome5 name="plane" size={24} color="white" />
          <Text style={styles.categoryText}>Flight</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.categoryItem, { backgroundColor: "#FF8C42" }]}>
          <FontAwesome5 name="bus" size={24} color="white" />
          <Text style={styles.categoryText}>Bus</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.categoryItem, { backgroundColor: "#805AD5" }]}>
          <FontAwesome5 name="hotel" size={24} color="white" />
          <Text style={styles.categoryText}>Hotel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.categoryItem, { backgroundColor: "#3FA34D" }]}>
          <FontAwesome5 name="train" size={24} color="white" />
          <Text style={styles.categoryText}>Train</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    alignItems: "center",
    width: "100%",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  tripCard: {
    backgroundColor: "#2563EB",
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
    width: "100%",
  },
  tripText: {
    color: "white",
    fontWeight: "bold",
  },
  time: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  date: {
    color: "white",
  },
  duration: {
    color: "white",
    textAlign: "center",
    marginVertical: 5,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  categoryItem: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    width: 80,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
});

export default HomeScreen;
