import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const pointMap: { [key: string]: number } = {
  A: 1,
  B: 2,
  C: 2,
  D: 1,
  E: 1,
  F: 2,
  G: 2,
  H: 1,
  I: 1,
  J: 3,
  K: 3,
  L: 1,
  M: 2,
  N: 1,
  O: 1,
  P: 2,
  Q: 3,
  R: 1,
  S: 1,
  T: 1,
  U: 2,
  V: 3,
  W: 2,
  X: 3,
  Y: 2,
  Z: 3,
};

interface GameData {
  id: number;
  timestamp: string;
  name: string;
  score: number;
  points: number;
  foundWords: string[];
  recentFoundWords: string[];
  bonusLetter: string;
}

const readLeaderboard = async () => {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("points", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching leaderboard data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while reading from the leaderboard",
        error,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

const writeToLeaderboard = async (entry: GameData) => {
  const leaderboardEntry = {
    id: entry.id,
    name: entry.name,
    score: entry.score,
    points: entry.points,
  };

  let isValidScore = validateScore(entry);

  if (isValidScore) {
    const { data, error } = await supabase
      .from("leaderboard")
      .insert([leaderboardEntry]);

    if (error) {
      console.error("Error writing to leaderboard:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "An error occurred while writing to the leaderboard",
          error,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } else {
    return {
      statusCode: 400,
      body: "Fraudulent entry detected.",
    };
  }
};

const validateScore = (entry: GameData): boolean => {
  let validScore = true;
  let countedWords = [""];

  let expectedPoints = 0;
  for (let word of entry.foundWords) {
    if (word.length !== 5) {
      validScore = false;
    }
    if (countedWords.includes(word)) {
      validScore = false;
    }
    countedWords.push(word);
    for (let letter of word) {
      if (letter === entry.bonusLetter) {
        expectedPoints += pointMap[letter] * 2;
      } else {
        expectedPoints += pointMap[letter];
      }
    }
  }

  if (expectedPoints !== entry.points) {
    validScore = false;
  }

  if (entry.recentFoundWords.length === 0) {
    validScore = false;
  }

  return validScore;
};

exports.handler = async (event: any) => {
  const { action, payload } = JSON.parse(event.body);

  switch (action) {
    case "readLeaderboard":
      return await readLeaderboard();
    case "writeToLeaderboard":
      return await writeToLeaderboard(payload);
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid action" }),
      };
  }
};
