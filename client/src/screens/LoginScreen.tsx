import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "../store/authStore";
import { connectSocket } from "../lib/socket";
import Toast from "react-native-toast-message";

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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Your Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
      />

      <Text style={{ marginTop: 20, textAlign: "center" }}>
        Don't have an account?{" "}
        <Text
          style={{ color: "#e07a5f", fontWeight: "bold" }}
          onPress={() => navigation.navigate("Register")}
        >
          Register here
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fffaf0",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
    color: "#7b3f00",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d3a15d",
    backgroundColor: "#fff8e1",
    padding: 12,
    marginBottom: 16,
    borderRadius: 10,
    fontSize: 16,
  },
});
