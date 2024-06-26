import { Text } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="view-org"
        options={{
          title: "View Organisation",
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons
                name="chevron-back-sharp"
                size={24}
                color={Colors.primary}
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
              <Ionicons
                name="ellipsis-horizontal-sharp"
                size={24}
                color={Colors.primary}
                style={{
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="view-profile"
        options={{
          title: "View Profile",
          headerRight: () => (
            <TouchableOpacity onPress={router.back}>
              <Text
                style={{
                  color: Colors.primary,
                  fontWeight: 500,
                  fontSize: 16,
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="group"
        options={{
          title: "Group",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="view-project"
        options={{
          presentation: "fullScreenModal",
          title: "View Project",
          headerShadowVisible: false,

          headerRight: () => (
            <TouchableOpacity onPress={router.back}>
              <Text
                style={{ color: Colors.primary, fontWeight: 500, fontSize: 16 }}
              >
                Done
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="filter" options={{ headerShown: false }} />
      <Stack.Screen
        name="review"
        options={{
          presentation: "fullScreenModal",
          title: "Review Member",
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons
                name="chevron-back-sharp"
                size={24}
                color={Colors.primary}
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
              <Ionicons
                name="ellipsis-horizontal-sharp"
                size={24}
                color={Colors.primary}
                style={{
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
