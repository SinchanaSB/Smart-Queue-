import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function MyTokenScreen({ route }) {
  const { token, location } = route.params;
  const [queue, setQueue] = useState({ current_token: 0, tokens_in_queue: 0, avg_wait_time: 0 });

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // auto refresh every 5 seconds
    return () => clearInterval(interval);
  }, [location]);

  async function fetchQueue() {
    try {
      const res = await axios.get(`${API_BASE_URL}/queue/status/${location}`);
      setQueue(res.data);
    } catch (err) {
      alert("Failed to fetch queue status");
    }
  }

  const position = token && queue.current_token ? Math.max(token - queue.current_token, 0) : 0;

  // Optional: different base wait times
  let baseWait = 2;
  if (location === "canteen") baseWait = 3;
  else if (location === "library") baseWait = 5;
  else if (location === "office") baseWait = 2;

  const estWait = queue.avg_wait_time ? position * baseWait : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{location.charAt(0).toUpperCase() + location.slice(1)} Queue</Text>
      <Text style={styles.info}>Your Token: {token}</Text>
      <Text style={styles.info}>Current Token: {queue.current_token}</Text>
      <Text style={styles.info}>People Waiting: {queue.tokens_in_queue}</Text>
      <Text style={styles.info}>Estimated Wait: {estWait} mins</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#cff4fc" },
  title: { fontSize: 26, fontWeight: "bold", color: "#055160", marginBottom: 15 },
  info: { fontSize: 18, color: "#055160", marginBottom: 10 },
});

/*import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function MyTokenScreen({ route }) {
  const { location, token } = route.params;
  const [queue, setQueue] = useState({ current_token: 0 });
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchQueue() {
    try {
      const res = await axios.get(`${API_BASE_URL}/queue/status/${location}`);
      setQueue(res.data);
      const diff = token - res.data.current_token;
      setWaitTime(diff > 0 ? diff * 2 : 0);
    } catch {
      alert("Error fetching queue");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Token</Text>
      <Text style={styles.token}>{token}</Text>
      <Text style={styles.info}>Current Token: {queue.current_token}</Text>
      <Text style={styles.info}>Estimated Wait Time: {waitTime} minutes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff3cd" },
  title: { fontSize: 26, fontWeight: "bold", color: "#664d03", marginBottom: 10 },
  token: { fontSize: 48, fontWeight: "bold", color: "#664d03", marginBottom: 20 },
  info: { fontSize: 18, color: "#664d03", marginBottom: 8 },
});*/
