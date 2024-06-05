import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { supabase } from "@/utils/supabase";
import { useProfileStore } from "@/utils/store/profile-store";
import { useUserIdStore } from "@/utils/store/user-id-store";
import { decode } from "base64-arraybuffer";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useSkillsStore } from "@/utils/store/skills-store";
import { useLanguagesStore } from "@/utils/store/languages-store";
import { useMyGroupsStore } from "@/utils/store/my-groups-store";

const Layout = () => {
  const router = useRouter();
  const userId = useUserIdStore((state) => state.userId);
  const imageBase64 = useProfileStore((state) => state.imageBase64);
  const imageMimeType = useProfileStore((state) => state.imageMimeType);
  const setImageUri = useProfileStore((state) => state.setImageUri);
  const { fullName, pronouns, university, course, linkedin, github, website } =
    useProfileStore();

  const skills = useSkillsStore((state) => state.skills);
  const languages = useLanguagesStore((state) => state.languages);

  const setGroups = useMyGroupsStore((state) => state.setGroups);

  useEffect(() => {
    const getImage = async () => {
      const { data, error } = await supabase.storage
        .from("profilepics")
        .download(userId);
      if (error) return;

      const fr = new FileReader();
      fr.readAsDataURL(data!);
      fr.onload = () => {
        setImageUri(fr.result as string);
      };
    };
    getImage();

    const getMyGroups = async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("group_id, groups(description, projects(name, max_group_size))")
        .eq("user_id", userId);
      if (error) {
        alert(error.message);
        return;
      }

      const groupIds = data.map((group) => group.group_id);

      const currentGroupSizes = new Map<string, number>();
      await Promise.all(
        groupIds.map(async (groupId) => {
          const { count, error } = await supabase
            .from("group_members")
            .select("*", { count: "exact", head: true })
            .eq("group_id", groupId);
          if (error) {
            alert(error.message);
          }
          currentGroupSizes.set(groupId, count ?? 0);
        })
      );

      setGroups(
        data.map((group) => ({
          projectName: group.groups?.projects?.name ?? "",
          maxGroupSize: group.groups?.projects?.max_group_size ?? 0,
          currentGroupSize: currentGroupSizes.get(group.group_id) ?? 0,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Shield_of_Imperial_College_London.svg/1200px-Shield_of_Imperial_College_London.svg.png",
        }))
      );
    };
    getMyGroups();
  }, []);

  const saveProfile = async () => {
    const { error } = await supabase.from("profiles").upsert({
      user_id: userId,
      full_name: fullName,
      pronouns,
      university,
      course,
      linkedin,
      github,
      website,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const { error: deleteError } = await supabase
      .from("user_skills")
      .delete()
      .eq("user_id", userId);
    if (deleteError) {
      alert(deleteError.message);
      return;
    }

    const { error: skillError } = await supabase
      .from("user_skills")
      .upsert(skills.map((skill) => ({ user_id: userId, skill_name: skill })));

    if (skillError) {
      alert(skillError.message);
      return;
    }

    const { error: deleteLanguageError } = await supabase
      .from("user_languages")
      .delete()
      .eq("user_id", userId);
    if (deleteLanguageError) {
      alert(deleteLanguageError.message);
      return;
    }

    const { error: languageError } = await supabase
      .from("user_languages")
      .upsert(
        languages.map((language) => ({
          user_id: userId,
          language_name: language,
        }))
      );

    if (languageError) {
      alert(languageError.message);
      return;
    }

    if (imageBase64 === "") {
      router.back();
      return;
    }
    const { error: picError } = await supabase.storage
      .from("profilepics")
      .upload(userId, decode(imageBase64), {
        contentType: imageMimeType,
        upsert: true,
      });
    if (picError) {
      alert(picError.message);
      return;
    }
    router.back();
  };

  return (
    <Stack>
      <Stack.Screen name="view-profile" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
          presentation: "fullScreenModal",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Text
                style={{ color: Colors.primary, fontWeight: 500, fontSize: 16 }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={saveProfile}>
              <Text
                style={{ color: Colors.primary, fontWeight: 500, fontSize: 16 }}
              >
                Save
              </Text>
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="skills"
        options={{
          title: "",
          presentation: "fullScreenModal",
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Text
                style={{ color: Colors.primary, fontWeight: 500, fontSize: 16 }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
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
      <Stack.Screen
        name="languages"
        options={{
          title: "",
          presentation: "fullScreenModal",
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Text
                style={{ color: Colors.primary, fontWeight: 500, fontSize: 16 }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
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
      <Stack.Screen
        name="[projectId]"
        options={{
          title: "My Group",
          presentation: "fullScreenModal",
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

const styles = StyleSheet.create({});
