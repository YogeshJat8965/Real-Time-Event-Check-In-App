import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
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

  // Fetch event
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

  // Socket listeners
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
    if (alreadyJoined) {
      leaveEvent();
    } else {
      joinEvent();
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        Event: {queryLoading ? "Loading..." : data?.event?.name || "N/A"}
      </Text>

      <Button
        title={alreadyJoined ? "Exit Event" : "Join Event"}
        onPress={handleToggleJoin}
      />

      {queryError && (
        <Text style={{ color: "red", marginTop: 10 }}>
          Failed to load event: {queryError.message}
        </Text>
      )}
      {joinError && (
        <Text style={{ color: "red", marginTop: 10 }}>
          Failed to join event: {joinError.message}
        </Text>
      )}
      {leaveError && (
        <Text style={{ color: "red", marginTop: 10 }}>
          Failed to exit event: {leaveError.message}
        </Text>
      )}

      <Text style={{ marginTop: 16, fontWeight: "bold" }}>Attendees:</Text>
      {attendees.length > 0 ? (
        attendees.map((user) => (
          <Text key={user.id}>👤 {user.name}</Text>
        ))
      ) : (
        <Text>No attendees yet.</Text>
      )}
    </View>
  );
}
