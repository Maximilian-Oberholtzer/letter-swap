import { supabase } from "../../supabaseClient";

export type LeaderboardEntry = {
  id: number;
  timestamp: string;
  name: string;
  score: number;
  points: number;
};

//Read database entries
export async function fetchLeaderboardData(): Promise<
  LeaderboardEntry[] | null
> {
  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("points", { ascending: false });

    if (error) {
      throw error;
    }
    return (data as LeaderboardEntry[]) || null;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return null;
  }
}
