import { supabase } from "./SupabaseConfig";
import { MemeType } from "../../utils/Types";

export async function addPost(post: MemeType): Promise<string | null> {
  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        username: post.username,
        image: post.image,
        // Removemos created_at - Supabase lo manejará automáticamente
      },
    ])
    .select();

  if (error) {
    console.error("Error adding post:", error);
    return null;
  }

  console.log("Post added with ID:", data[0]?.id);
  return data[0]?.id || null;
}