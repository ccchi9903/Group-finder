import { supabase } from "../supabase";
import { DRPResponse } from "./error-types";
import { getOrganisationPicUrl } from "./organisation-pics";
import { getProfilePicUrl } from "./profile-pics";
import { Profile } from "./profiles";
import { Project } from "./project-details";
import { getProjectPicUrl } from "./project-pics";

export type Organisation = {
  name: string;
  subtitle: string;
  description: string;
  org_id: string;
  image: string;
};

export const getOrganisationById: (
  orgId: string
) => Promise<DRPResponse<Organisation>> = async (orgId) => {
  const { data: rawData, error } = await supabase
    .from("organisations")
    .select("*")
    .eq("org_id", orgId)
    .single();
  if (error) return { data: null, error };

  const data = {
    ...rawData,
    image: getOrganisationPicUrl(rawData.org_id).data!,
  };
  return { data, error: null };
};

export const getAllJoinedOrganisations: (
  userId: string
) => Promise<DRPResponse<Organisation[]>> = async (userId) => {
  const { data: rawData, error } = await supabase
    .from("organisation_members")
    .select("organisations(*)")
    .eq("user_id", userId);
  if (error) return { data: null, error };

  const data: Organisation[] = rawData.map((organisation) => ({
    ...organisation.organisations!,
    image: getOrganisationPicUrl(organisation.organisations!.org_id).data!,
  }));
  return { data, error: null };
};

export const getAllOrganisationsExceptJoined: (
  userId: string
) => Promise<DRPResponse<Organisation[]>> = async (userId) => {
  const { data: rawData, error } = await supabase
    .from("organisations")
    .select("*, organisation_members(user_id)");
  if (error) return { data: null, error };

  const data: Organisation[] = rawData
    .filter(
      (organisation) =>
        !organisation.organisation_members.some(
          (member) => member.user_id === userId
        ) && organisation.leader !== userId
    )
    .map((organisation) => ({
      ...organisation,
      image: getOrganisationPicUrl(organisation.org_id).data!,
    }));

  return { data, error: null };
};

export const getProjectsByOrganisation: (
  orgId: string
) => Promise<DRPResponse<Project[]>> = async (orgId) => {
  const { data, error } = await supabase
    .from("organisations")
    .select("projects(*)")
    .eq("org_id", orgId)
    .single();
  if (error) return { data: null, error };
  return {
    data: data.projects.map((project) => ({
      ...project,
      image_uri: getProjectPicUrl(project.project_id).data!,
    })),
    error: null,
  };
};

export const joinOrganisation: (
  orgId: string,
  userId: string
) => Promise<DRPResponse<null>> = async (orgId, userId) => {
  return await supabase
    .from("organisation_members")
    .insert({ org_id: orgId, user_id: userId });
};

export const joinAllProjectsInOrg: (
  orgId: string,
  userId: string
) => Promise<DRPResponse<null>> = async (orgId, userId) => {
  // Get all projects in organisation
  const { data, error } = await supabase
    .from("projects")
    .select("project_id")
    .eq("org_id", orgId);
  if (error) return { data: null, error };

  for (const projectId of data.map((project) => project.project_id)) {
    // Create group
    const { data: newGroup, error: newGroupError } = await supabase
      .from("groups")
      .insert({ project_id: projectId })
      .select()
      .single();
    if (newGroupError) return { data: null, error: newGroupError };

    // Add yourself to the new group
    const { error: joinNewGroupError } = await supabase
      .from("group_members")
      .insert({ group_id: newGroup.group_id, user_id: userId });
    if (joinNewGroupError) return { data: null, error: joinNewGroupError };
  }

  return { data: null, error: null };
};

export const leaveOrganisation: (
  orgId: string,
  userId: string
) => Promise<DRPResponse<null>> = async (orgId, userId) => {
  return await supabase
    .from("organisation_members")
    .delete()
    .eq("org_id", orgId)
    .eq("user_id", userId);
};

export const getOrganisationsByLeader: (
  leader: string
) => Promise<DRPResponse<Organisation[]>> = async (leader) => {
  const { data: rawData, error } = await supabase
    .from("organisations")
    .select()
    .eq("leader", leader);
  if (error) return { data: null, error };
  const data: Organisation[] = rawData.map((organisation) => ({
    ...organisation,
    image: getOrganisationPicUrl(organisation.org_id).data!,
  }));
  return { data, error: null };
};

export const getAllAffiliatedOrganisations: (
  userId: string
) => Promise<DRPResponse<Organisation[]>> = async (userId) => {
  try {
    // Execute both functions concurrently
    const [organisationsByLeader, joinedOrganisations] = await Promise.all([
      getOrganisationsByLeader(userId),
      getAllJoinedOrganisations(userId),
    ]);

    // Check for errors in either function
    if (organisationsByLeader.error || joinedOrganisations.error) {
      return {
        data: null,
        error: organisationsByLeader.error || joinedOrganisations.error,
      };
    }

    // Combine the data from both functions
    const combinedData = [
      ...organisationsByLeader.data!,
      ...joinedOrganisations.data!,
    ];

    return { data: combinedData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getAllMembersInOrganisation: (
  org_id: string
) => Promise<DRPResponse<Profile[]>> = async (org_id) => {
  const { data: rawData, error } = await supabase
    .from("organisation_members")
    .select(
      "profiles(*, user_skills(skill_name), user_languages(language_name))"
    )
    .eq("org_id", org_id);
  if (error) return { data: null, error };

  const data: Profile[] = rawData.map((member) => {
    const profile = member.profiles!;
    return {
      ...profile,
      id: profile.user_id,
      skills: profile.user_skills.map((skill) => skill.skill_name),
      languages: profile.user_languages.map(
        (language) => language.language_name
      ),
      imageUrl: getProfilePicUrl(profile.user_id).data!,
      rating: 0,
    };
  });
  return { data, error: null };
};
