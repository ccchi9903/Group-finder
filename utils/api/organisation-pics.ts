import { decode } from "base64-arraybuffer";
import { supabase } from "../supabase";
import { DRPResponse } from "./error-types";

export const getOrganisationPicUrl: (organisationId: string) => DRPResponse<string> = (
  organisationId
) => {
  const { data } = supabase.storage.from("organisationpics").getPublicUrl(organisationId);
  return { data: data.publicUrl, error: null };
};

export const uploadOrganisationPic: (
  organisationId: string,
  imageBase64: string,
  imageMimeType: string
) => Promise<DRPResponse<null>> = async (
  organisationId,
  imageBase64,
  imageMimeType
) => {
  const { error } = await supabase.storage
    .from("organisationpics")
    .upload(organisationId, decode(imageBase64), {
      contentType: imageMimeType,
    });
  if (error) return { data: null, error };
  return { data: null, error: null };
};
