// screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "../store/authStore";
import { connectSocket } from "../lib/socket";
import Toast from "react-native-toast-message";
import styles from "./Loginscreen.styles";

const LOGIN_USER = gql`
  mutation Login($name: String!, $email: String!) {
    loginUser(name: $name, email: $email) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export default function LoginScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const login = useAuthStore((state) => state.login);
  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  const handleLogin = async () => {
    if (!name || !email) {
      Alert.alert("Missing Info", "Please enter both name and email.");
      return;
    }

    try {
      const { data } = await loginUser({ variables: { name, email } });
      if (data?.loginUser) {
        login(data.loginUser.user, data.loginUser.token);
        connectSocket(data.loginUser.token);
        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: `Welcome back, ${data.loginUser.user.name}!`,
        });
        navigation.navigate("EventList");
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: "Invalid credentials or server error.",
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: "Something went wrong during login.",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>🚀 Event Check-In</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="👤 Your Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="📧 Your Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.loginText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          Don't have an account?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            Register here
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
