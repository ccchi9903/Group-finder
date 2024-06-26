import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Link, router } from "expo-router";
import { supabase } from "@/utils/supabase";
import { defaultStyles } from "@/constants/DefaultStyles";
import SignUpButton from "@/components/auth/SignUpButton";

const SignUp = () => {
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.description}>
        Enter the email you wish to be associated with your account
      </Text>
      <TextInput
        placeholder="Email"
        style={styles.textInput}
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <View style={styles.dontHaveAccountContainer}>
        <Text style={{ color: Colors.gray }}>Already have an account? </Text>
        <Link href={"/signin"}>
          <Text style={{ color: Colors.primary, fontWeight: 600 }}>
            Sign In
          </Text>
        </Link>
      </View>
      <SignUpButton shouldCreateUser={true} email={email}/>
    </View>
  );
};

export default SignUp;

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
});
