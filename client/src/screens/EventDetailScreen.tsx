import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useMutation, useQuery, gql } from "@apollo/client";
import { getSocket } from "../lib/socket";
import { useAuthStore } from "../store/authStore";

// Types
type Attendee = {
  id: string;
  name: string;
};

// GraphQL Queries
const EVENT_QUERY = gql`
  query Event($id: ID!) {
    event(id: $id) {
      id
      name
      attendees {
        id
        name
      }
    }
  }
`;

const JOIN_EVENT = gql`
  mutation Join($eventId: ID!) {
    joinEvent(eventId: $eventId) {
      id
      attendees {
        id
        name
      }
    }
  }
`;

const LEAVE_EVENT = gql`
  mutation Leave($eventId: ID!) {
    leaveEvent(eventId: $eventId) {
      id
      attendees {
        id
        name
      }
    }
  }
`;

export default function EventDetailScreen({ route }: any) {
  const { eventId } = route.params;
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const user = useAuthStore((s) => s.user);

  const { data, error: queryError, loading: queryLoading, refetch } = useQuery(EVENT_QUERY, {
    variables: { id: eventId },
    onCompleted: (data) => {
      if (data?.event?.attendees) setAttendees(data.event.attendees);
    },
  });

  const [joinEvent, { error: joinError }] = useMutation(JOIN_EVENT, {
    variables: { eventId },
    onCompleted: (data) => {
      if (data?.joinEvent?.attendees) setAttendees(data.joinEvent.attendees);
    },
  });

  const [leaveEvent, { error: leaveError }] = useMutation(LEAVE_EVENT, {
    variables: { eventId },
    onCompleted: (data) => {
      if (data?.leaveEvent?.attendees) setAttendees(data.leaveEvent.attendees);
    },
  });

  // Real-time socket listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("joinRoom", eventId);

    const handleUserJoined = () => refetch();
    const handleUserLeft = () => refetch();

    socket.on("userJoined", handleUserJoined);
    socket.on("userLeft", handleUserLeft);

    return () => {
      socket.emit("leaveRoom", eventId);
      socket.off("userJoined", handleUserJoined);
      socket.off("userLeft", handleUserLeft);
    };
  }, [eventId, refetch]);

  const alreadyJoined = attendees.some((u) => u.id === user?.id);

  const handleToggleJoin = () => {
    if (alreadyJoined) leaveEvent();
    else joinEvent();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🎉 Event Details</Text>

        {queryLoading ? (
          <ActivityIndicator size="large" color="#6200EE" />
        ) : (
          <Text style={styles.eventName}>{data?.event?.name || "Event Not Found"}</Text>
        )}

        <TouchableOpacity
          onPress={handleToggleJoin}
          style={[
            styles.button,
            { backgroundColor: alreadyJoined ? "#FF5C5C" : "#4CAF50" },
          ]}
        >
          <Text style={styles.buttonText}>
            {alreadyJoined ? "🚪 Leave Event" : "✅ Join Event"}
          </Text>
        </TouchableOpacity>

        {queryError && <Text style={styles.error}>❌ {queryError.message}</Text>}
        {joinError && <Text style={styles.error}>❌ {joinError.message}</Text>}
        {leaveError && <Text style={styles.error}>❌ {leaveError.message}</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeading}>👥 Attendees</Text>
        {attendees.length > 0 ? (
          <FlatList
            data={attendees}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Text style={styles.attendeeItem}>• {item.name}</Text>
            )}
          />
        ) : (
          <Text style={{ marginTop: 8, color: "#666" }}>No attendees yet.</Text>
        )}
      </View>
    </View>
  );
}

// 🔧 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 3, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },
  eventName: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
    color: "#6200EE",
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  attendeeItem: {
    fontSize: 16,
    paddingVertical: 4,
    color: "#444",
  },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  error: {
    marginTop: 10,
    color: "red",
    fontSize: 14,
  },
});
