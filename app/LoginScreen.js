import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "./firebaseConfig"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve the user document from Firestore
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      const userData = userDoc.data();
      console.log("User Data:", userData);

      // Check the user's role from Firestore data and store it
      if (userData) {
        await AsyncStorage.setItem("@user", JSON.stringify(userData));
        await AsyncStorage.setItem("@role", userData.role || "user"); // Default role if not defined
        Alert.alert("Login Successful ✅", "You have successfully logged in!", [
          {
            text: "OK",
            onPress: () => {
              // Reset email and password fields
              setEmail("");
              setPassword("");
              navigation.navigate("Home");
            },
          },
        ]);
      } else {
        Alert.alert("Login Error", "User data not found.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to CampoNews</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#666" />
        <TextInput
          placeholder="Email"
          style={styles.input}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#666" />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
        <Text style={styles.footerText}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#4285F4",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  footerText: {
    color: "#4285F4",
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
  },
});

export default LoginScreen;
