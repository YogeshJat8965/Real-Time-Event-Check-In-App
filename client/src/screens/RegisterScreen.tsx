import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

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
        title={loading ? "Registering..." : "Register"}
        onPress={handleRegister}
      />
      <Text style={{ marginTop: 20, textAlign: "center" }}>
        Already have an account?{" "}
        <Text
          style={{ color: "#e07a5f", fontWeight: "bold" }}
          onPress={() => navigation.navigate("Login")}
        >
          Login here
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
    backgroundColor: "#fef6e4", 
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#6b4226",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0a96d",
    backgroundColor: "#fff1d6",
    padding: 12,
    marginBottom: 18,
    borderRadius: 10,
    fontSize: 16,
  },
});
