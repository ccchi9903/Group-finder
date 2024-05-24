import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { supabase } from "@/utils/supabase";

const Index = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the OTP!");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.description}>
        Enter the email associated with your account
      </Text>
      <TextInput
        placeholder="Email"
        style={styles.textInput}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <View style={styles.dontHaveAccountContainer}>
        <Text style={{ color: Colors.gray }}>Don't have an account yet? </Text>
        <Link href={"signup"}>
          <Text style={{ color: Colors.primary, fontWeight: 600 }}>
            Sign Up
          </Text>
        </Link>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={120}
      >
        <TouchableOpacity
          style={styles.signInButton}
          disabled={loading}
          onPress={() => signInWithEmail()}
        >
          <Text style={{ color: "white" }}>Sign In</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: Colors.background,
    height: "100%",
  },
  dontHaveAccountContainer: {
    marginTop: 16,
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    marginTop: 8,
    color: Colors.gray,
  },
  textInput: {
    backgroundColor: Colors.lightGray,
    width: "100%",
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: "auto",
    alignItems: "center",
  },
});
