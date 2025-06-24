// screens/EventListScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useQuery, gql, useApolloClient } from "@apollo/client";
import { getSocket } from "../lib/socket";
import { useAuthStore } from "../store/authStore";
import FlashBanner from "../components/Flashbanner";
import styles from "./EventListScreen.styles";

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.on("userJoined", () => refetch());
    return () => socket.off("userJoined");
  }, [refetch]);

  const handleLogout = () => {
    const socket = getSocket();
    socket?.disconnect();
    logout();
    client.clearStore();
    navigation.replace("Login");
  };

  useEffect(() => {
    if (!data?.events || data.events.length === 0) return;

    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex((prev) => (prev + 1) % data.events.length);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [data, fadeAnim, scaleAnim]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={{ marginTop: 8 }}>Loading Events...</Text>
      </View>
    );
  }

  const currentEvent = data?.events?.[currentIndex];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>🎉 Upcoming Events</Text>

      <FlatList
        data={data.events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EventDetail", { eventId: item.id })
            }
            style={styles.card}
          >
            <Text style={styles.eventTitle}>{item.name}</Text>
            <Text style={styles.location}>📍 {item.location}</Text>
            <Text style={styles.attendees}>
              👥 {item.attendees.length} joined
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* 🔥 Flash Banner */}
      <FlashBanner
        event={currentEvent}
        fadeAnim={fadeAnim}
        scaleAnim={scaleAnim}
        onPress={() =>
          navigation.navigate("EventDetail", { eventId: currentEvent?.id })
        }
      />
    </View>
  );
}
