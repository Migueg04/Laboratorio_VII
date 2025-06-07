import { supabase } from "./SupabaseConfig";
import { MemeType } from "../../utils/Types";

export async function fetchPosts(): Promise<MemeType[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    // Asegurar que created_at siempre tenga un valor
    const posts: MemeType[] = data.map(post => ({
      id: post.id,
      username: post.username,
      image: post.image,
      created_at: post.created_at || new Date().toISOString()
    }));

    return posts;
  } catch (error) {
    console.error('Error in fetchPosts:', error);
    return [];
  }
}