import { Dispatch, SetStateAction } from "react";

export type LeaderboardEntry = {
  id: number;
  timestamp: string;
  name: string;
  score: number;
  points: number;
};

export async function fetchLeaderboardData(
  setLeaderboardData: Dispatch<SetStateAction<LeaderboardEntry[] | null>>
) {
  const response = await fetch("/.netlify/functions/leaderboardActions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "readLeaderboard" }),
  });

  if (response.ok) {
    const data = await response.json();
    // console.log("Leaderboard data:", data);
    setLeaderboardData(data);
  } else {
    console.error("An error occurred while fetching leaderboard data");
  }
}

export async function writeToLeaderboard(entry: {
  id: number;
  name: string;
  score: number;
  points: number;
}) {
  try {
    const response = await fetch("/.netlify/functions/leaderboardActions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "writeToLeaderboard",
        payload: entry,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error writing to leaderboard: ${response.status}`);
    }

    // const data = await response.json();
    // console.log("Leaderboard entry added:", data);
  } catch (error) {
    console.error("Error writing to leaderboard:", error);
  }
}
