import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "../store/authStore";

const REGISTER_USER = gql`
  mutation Register($name: String!, $email: String!) {
    registerUser(name: $name, email: $email) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const register = useAuthStore((state) => state.login);

  const [registerUser, { loading }] = useMutation(REGISTER_USER);

  const handleRegister = async () => {
    if (!name || !email) {
      Alert.alert("Missing Fields", "Please enter both name and email.");
      return;
    }

    try {
      const { data } = await registerUser({ variables: { name, email } });
      if (data?.registerUser) {
        register(data.registerUser.user, data.registerUser.token);
        navigation.navigate("EventList");
      } else {
        Alert.alert("Registration Failed", "Please try again.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An error occurred during registration.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>📝 Create an Account</Text>
      <Text style={styles.subtitle}>Let’s get started</Text>

      <TextInput
        style={styles.input}
        placeholder="👤 Your Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="📧 Your Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        activeOpacity={0.85}
      >
        <Text style={styles.registerText}>
          {loading ? "Registering..." : "Register"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.loginLink}>
        Already have an account?{" "}
        <Text
          style={styles.loginText}
          onPress={() => navigation.navigate("Login")}
        >
          Login here
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffdf6",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#5a3e2b",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginBottom: 28,
  },
  input: {
    backgroundColor: "#fff7eb",
    borderColor: "#e0a96d",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: "#d2691e",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
    fontSize: 14,
  },
  loginText: {
    color: "#e07a5f",
    fontWeight: "bold",
  },
});
