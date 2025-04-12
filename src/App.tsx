import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LogWorkoutPage from './pages/LogWorkoutPage';
import HistoryPage from './pages/HistoryPage';
import './index.css';

// --- Interfaces ---
export interface StructuredActivity {
  activityType: 'resistance' | 'cardio' | 'other';
  exerciseName: string;
  sets?: number;
  reps?: number | string;
  weight?: number;
  weightUnit?: 'lbs' | 'kg';
  duration?: number;
  durationUnit?: 'minutes' | 'seconds' | 'hours';
  distance?: number;
  distanceUnit?: 'km' | 'miles' | 'meters';
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  text: string;
  date: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
  structuredData?: StructuredActivity[];
  error?: string;
}
// --- ---

// --- Gemini Setup ---
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
if (API_KEY && typeof API_KEY === 'string' && API_KEY !== 'YOUR_API_KEY_HERE') {
    try {
        genAI = new GoogleGenerativeAI(API_KEY);
    } catch (e) {
        console.error("Failed to initialize GoogleGenerativeAI:", e);
    }
} else {
    console.error("Gemini API Key (VITE_GEMINI_API_KEY) not found or invalid in .env file.");
}

const model = genAI?.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 0.2,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
  responseMimeType: "application/json",
};

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];
// --- ---

function App() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);

  useEffect(() => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    setIsApiKeyValid(!!key && typeof key === 'string' && key !== 'YOUR_API_KEY_HERE');
  }, []);

  // --- AI Processing Function ---
  const processWorkoutLog = async (logId: string, logText: string) => {
    if (!model || !isApiKeyValid) {
        console.error("Gemini model or API Key not initialized.");
        setWorkoutLogs(prevLogs => prevLogs.map(log =>
            log.id === logId ? { ...log, status: 'error', error: "API Key not configured." } : log
        ));
        return;
    }

    setWorkoutLogs(prevLogs => prevLogs.map(log =>
        log.id === logId ? { ...log, status: 'processing' } : log
    ));

    const prompt = `
      You are a fitness log parser. Your task is to analyze the user's text description of their workout and extract structured data for each distinct activity.

      **Instructions:**
      1.  **Focus ONLY on workout activities.** If the input text is clearly not describing a physical workout (e.g., asking for code, general conversation, unrelated topics), respond ONLY with the JSON: \`{"error": "Input is not workout related."}\`. Do not add any other text.
      2.  If the input IS workout-related, extract the details for each activity mentioned.
      3.  Return the extracted data as a JSON array of objects. Each object should represent one activity and follow this structure:
          \`\`\`json
          {
            "activityType": "'resistance' | 'cardio' | 'other'",
            "exerciseName": "string (e.g., 'Bench Press', 'Running', 'Yoga')",
            "sets": "number (optional, for resistance)",
            "reps": "number | string (optional, for resistance, e.g., 10 or '8-12' or 'max')",
            "weight": "number (optional, for resistance)",
            "weightUnit": "'lbs' | 'kg' (optional, default to lbs if unspecified but weight is present)",
            "duration": "number (optional, for cardio/other)",
            "durationUnit": "'minutes' | 'seconds' | 'hours' (optional, default to minutes if unspecified but duration is present)",
            "distance": "number (optional, for cardio)",
            "distanceUnit": "'km' | 'miles' | 'meters' (optional, default to km if unspecified but distance is present)",
            "notes": "string (optional, any extra details like 'felt good', 'PR')"
          }
          \`\`\`
      4.  Infer units (lbs/kg, min/sec/hr, km/miles/m) if not explicitly stated but context suggests them (use common defaults like lbs, minutes, km).
      5.  If you cannot extract any meaningful workout data from a workout-related input, return an empty JSON array: \`[]\`.
      6.  Ensure the output is ONLY the valid JSON array or the specific error JSON mentioned in step 1. Do not include any introductory text, explanations, or markdown formatting.

      **User Input to Process:**
      "${logText}"
    `;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
            safetySettings,
        });
        const response = result.response;
        const responseText = response.text();
        console.log("Gemini Response Text:", responseText);

        let parsedData;
        try {
            parsedData = JSON.parse(responseText);
        } catch (parseError) {
            console.error("JSON Parsing Error:", parseError);
            setWorkoutLogs(prevLogs => prevLogs.map(log =>
                log.id === logId ? { ...log, status: 'error', error: "Failed to parse AI response." } : log
            ));
            return;
        }

        if (parsedData && parsedData.error) {
             setWorkoutLogs(prevLogs => prevLogs.map(log =>
                log.id === logId ? { ...log, status: 'error', error: parsedData.error } : log
            ));
        }
        else if (Array.isArray(parsedData)) {
            const isValidData = parsedData.every(item => typeof item === 'object' && item !== null && 'activityType' in item && 'exerciseName' in item);
            if (isValidData) {
                setWorkoutLogs(prevLogs => prevLogs.map(log =>
                    log.id === logId ? { ...log, status: 'completed', structuredData: parsedData as StructuredActivity[] } : log
                ));
            } else if (parsedData.length === 0) {
                 setWorkoutLogs(prevLogs => prevLogs.map(log =>
                    log.id === logId ? { ...log, status: 'completed', structuredData: [] } : log
                ));
            }
            else {
                 console.error("Parsed data is an array but items have invalid structure:", parsedData);
                 setWorkoutLogs(prevLogs => prevLogs.map(log =>
                    log.id === logId ? { ...log, status: 'error', error: "Received invalid data structure." } : log
                ));
            }
        }
        else {
            console.error("Unexpected response format:", parsedData);
            setWorkoutLogs(prevLogs => prevLogs.map(log =>
                log.id === logId ? { ...log, status: 'error', error: "Received unexpected data format." } : log
            ));
        }

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      let errorMessage = "API communication failed.";
      if (error instanceof Error) {
          errorMessage = `API Error: ${error.message}`; // Provide more specific error if possible
      }
      setWorkoutLogs(prevLogs => prevLogs.map(log =>
        log.id === logId ? { ...log, status: 'error', error: errorMessage } : log
      ));
    }
  };
  // --- ---

  // --- Log Submission Handler ---
  const handleLogSubmit = (logText: string) => {
    const newLog: WorkoutLog = {
      id: crypto.randomUUID(),
      text: logText,
      date: new Date(),
      status: 'pending',
    };
    setWorkoutLogs(prevLogs => [newLog, ...prevLogs]);
    console.log('New workout log initiated:', newLog.id, logText);
    processWorkoutLog(newLog.id, logText); // Call the processing function
  };
  // --- ---

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout onLogSubmit={handleLogSubmit} />}>
          <Route index element={<HomePage workoutLogs={workoutLogs} isApiKeyValid={isApiKeyValid} />} />
          <Route path="log" element={<LogWorkoutPage />} />
          <Route path="history" element={<HistoryPage workoutLogs={workoutLogs} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
