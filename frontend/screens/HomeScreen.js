import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Smart Queue</Text>
      <Button
        title="Canteen Queue"
        color="#0f5132"
        onPress={() => navigation.navigate("Queue", { location: "canteen" })}
      />
      <Button
        title="Library Queue"
        color="#055160"
        onPress={() => navigation.navigate("Queue", { location: "library" })}
      />
      <Button
        title="Office Queue"
        color="#664d03"
        onPress={() => navigation.navigate("Queue", { location: "office" })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#d1e7dd" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
});
/*import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Smart Queue</Text>
      <Text style={styles.subtitle}>Select your destination</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Canteen Queue"
          color="#0f5132"
          onPress={() => navigation.navigate("Queue", { location: "canteen" })}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Library Queue"
          color="#055160"
          onPress={() => navigation.navigate("Queue", { location: "library" })}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Office Queue"
          color="#664d03"
          onPress={() => navigation.navigate("Queue", { location: "office" })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d1e7dd",
    padding: 40,
  },
  title: {
    fontSize: 52, // ⬅️ increased from 28
    fontWeight: "bold",
    color: "#0f5132",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 32, // ⬅️ increased from 18
    color: "#0f5132",
    marginBottom: 30,
  },
  buttonContainer: {
    marginVertical: 15,
    width: "80%",
  },
});*/
