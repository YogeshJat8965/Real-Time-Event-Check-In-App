// screens/EventListScreen.styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#FF4D4D",
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  logoutText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6200EE",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  attendees: {
    fontSize: 13,
    color: "#666",
  },
});
