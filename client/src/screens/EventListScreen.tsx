import React, { useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { useQuery, gql, useApolloClient } from "@apollo/client";
import { getSocket } from "../lib/socket";
import { useAuthStore } from "../store/authStore";

const EVENTS_QUERY = gql`
  query {
    events {
      id
      name
      location
      startTime
      attendees {
        id
      }
    }
  }
`;

export default function EventListScreen({ navigation }: any) {
  const client = useApolloClient();
  const { data, loading, refetch } = useQuery(EVENTS_QUERY);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      console.warn("⚠️ Socket not connected yet.");
      return;
    }

    const handleUserJoined = () => {
      refetch(); // Refetch event list when someone joins
    };

    socket.on("userJoined", handleUserJoined);

    return () => {
      socket.off("userJoined", handleUserJoined);
    };
  }, [refetch]);

  const handleLogout = () => {
    const socket = getSocket();
    socket?.disconnect(); // clean socket connection
    logout(); // clear token + user
    client.clearStore(); // optional: clear Apollo cache
    navigation.replace("Login");
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Button title="Logout" color="#d9534f" onPress={handleLogout} />

      <Text style={styles.heading}>Events</Text>

      <FlatList
        data={data.events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Button
              title={`${item.name} (${item.location}) - ${item.attendees.length} joined`}
              onPress={() =>
                navigation.navigate("EventDetail", { eventId: item.id })
              }
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
  eventItem: {
    marginBottom: 12,
  },
});
