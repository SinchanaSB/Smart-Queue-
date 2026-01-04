import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function QueueScreen({ route, navigation }) {
  const { location } = route.params;
  const [queue, setQueue] = useState({ current_token: 0, tokens_in_queue: 0, avg_wait_time: 0 });
  const [myToken, setMyToken] = useState(null);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // auto refresh every 5 seconds
    return () => clearInterval(interval);
  }, [location]);

  async function fetchQueue() {
    try {
      const res = await axios.get(`${API_BASE_URL}/queue/status/${location}`);
      setQueue(res.data);
    } catch {
      alert("Error fetching queue");
    }
  }

  async function takeToken() {
    try {
      const res = await axios.post(`${API_BASE_URL}/queue/join`, { location });
      setMyToken(res.data.token);
      navigation.navigate("MyToken", { location, token: res.data.token, queue: queue });
    } catch {
      alert("Failed to take token");
    }
  }

  // ===== Safe estimated wait calculation =====
  const position = myToken && queue.current_token
    ? Math.max(myToken - queue.current_token, 0)
    : 0;

  // Optional: different base wait times
  let baseWait = 2; // default
  if (location === "canteen") baseWait = 3;
  else if (location === "library") baseWait = 5;
  else if (location === "office") baseWait = 2;

  const estWait = queue.avg_wait_time ? position * baseWait : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {location.charAt(0).toUpperCase() + location.slice(1)} Queue
      </Text>

      <Text style={styles.info}>Current Token: {queue.current_token}</Text>
      <Text style={styles.info}>People Waiting: {queue.tokens_in_queue}</Text>
      <Text style={styles.info}>Estimated wait time: {estWait} mins</Text>

      <Button title="Take Token" onPress={takeToken} color="#0dcaf0" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#cff4fc" },
  title: { fontSize: 26, fontWeight: "bold", color: "#055160", marginBottom: 15 },
  info: { fontSize: 18, color: "#055160", marginBottom: 10 },
});

/*import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function QueueScreen({ route, navigation }) {
  const { location } = route.params;
  const [queue, setQueue] = useState({ current_token: 0, tokens_in_queue: 0 });
  const [myToken, setMyToken] = useState(null);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [location]);

  async function fetchQueue() {
    try {
      const res = await axios.get(`${API_BASE_URL}/queue/status/${location}`);
      setQueue(res.data);
    } catch {
      alert("Error fetching queue");
    }
  }

  async function takeToken() {
    try {
      const res = await axios.post(`${API_BASE_URL}/queue/join`, { location });
      setMyToken(res.data.token);
      navigation.navigate("MyToken", { location, token: res.data.token });
    } catch {
      alert("Failed to take token");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {location.charAt(0).toUpperCase() + location.slice(1)} Queue
      </Text>
      <Text style={styles.info}>Current Token: {queue.current_token}</Text>
      <Text style={styles.info}>People Waiting: {queue.tokens_in_queue}</Text>

      <Button title="Take Token" onPress={takeToken} color="#0dcaf0" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#cff4fc" },
  title: { fontSize: 26, fontWeight: "bold", color: "#055160", marginBottom: 15 },
  info: { fontSize: 18, color: "#055160", marginBottom: 10 },
});*/
