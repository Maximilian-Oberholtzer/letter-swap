import { createClient } from "@supabase/supabase-js";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import format from "date-fns/format";
import { startOfMonth, endOfMonth } from "date-fns";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface GameData {
  id: number;
  timestamp: string;
  name: string;
  score: number;
  points: number;
  foundWords: string[];
  recentFoundWords: string[];
}

const readLeaderboard = async () => {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("points", { ascending: false })
    .limit(15);

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

const readDailyLeaderboard = async () => {
  const currentDate = new Date();
  const timeZone = "America/New_York"; // Eastern Time (ET)

  // Convert current date to the beginning of the day in ET
  const startOfDayET = utcToZonedTime(currentDate, timeZone);
  startOfDayET.setHours(0, 0, 0, 0);

  // Convert current date to the end of the day in ET
  const endOfDayET = new Date(startOfDayET);
  endOfDayET.setHours(23, 59, 59, 999);

  // Convert start and end times back to UTC
  const startOfDayUTC = zonedTimeToUtc(startOfDayET, timeZone);
  const endOfDayUTC = zonedTimeToUtc(endOfDayET, timeZone);

  // Format the UTC dates to ISO strings
  const startOfDayISOString = format(
    startOfDayUTC,
    "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
  );
  const endOfDayISOString = format(endOfDayUTC, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("points", { ascending: false })
    .filter("created_at", "gte", startOfDayISOString)
    .filter("created_at", "lte", endOfDayISOString)
    .limit(15);

  if (error) {
    console.error("Error fetching daily leaderboard data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while reading from the daily leaderboard",
        error,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

const readMonthlyLeaderboard = async () => {
  const currentDate = new Date();
  const timeZone = "America/New_York"; // Eastern Time (ET)

  // Calculate the start and end of the month in ET
  const startOfMonthET = utcToZonedTime(startOfMonth(currentDate), timeZone);
  const endOfMonthET = utcToZonedTime(endOfMonth(currentDate), timeZone);

  // Convert start and end times back to UTC
  const startOfMonthUTC = zonedTimeToUtc(startOfMonthET, timeZone);
  const endOfMonthUTC = zonedTimeToUtc(endOfMonthET, timeZone);

  // Format the UTC dates to ISO strings
  const startOfMonthISOString = format(
    startOfMonthUTC,
    "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
  );
  const endOfMonthISOString = format(
    endOfMonthUTC,
    "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
  );

  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("points", { ascending: false })
    .filter("created_at", "gte", startOfMonthISOString)
    .filter("created_at", "lte", endOfMonthISOString)
    .limit(15);

  if (error) {
    console.error("Error fetching monthly leaderboard data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while reading from the monthly leaderboard",
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

  for (let word of entry.foundWords) {
    if (word.length !== 5) {
      validScore = false;
    }
    if (countedWords.includes(word)) {
      validScore = false;
    }
    countedWords.push(word);
  }

  if (countedWords.length - 1 !== entry.score) {
    validScore = false;
  }

  if (entry.id.toString().length !== 8) {
    validScore = false;
  }

  return validScore;
};

exports.handler = async (event: any) => {
  const { action, payload } = JSON.parse(event.body);

  switch (action) {
    case "readLeaderboard":
      return await readLeaderboard();
    case "readDailyLeaderboard":
      return await readDailyLeaderboard();
    case "readMonthlyLeaderboard":
      return await readMonthlyLeaderboard();
    case "writeToLeaderboard":
      return await writeToLeaderboard(payload);
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid action" }),
      };
  }
};
