
import { GoogleGenAI, Type } from "@google/genai";
import { Booking } from "../types";
import { createNewBooking } from "./storageService";

// Initialize Gemini lazily
let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    // Check if process is defined (e.g. in Vite build with define) or fallback to empty string
    // to prevent runtime crash in browser environments where process is not shimmed.
    // The API key is assumed to be available via process.env.API_KEY.
    const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const parseBookingCommand = async (command: string): Promise<Booking | null> => {
  try {
    const client = getAiClient();
    const model = "gemini-2.5-flash";
    const today = new Date().toISOString().split('T')[0];
    const systemInstruction = `
      You are an intelligent assistant for "ShootSync", a premium wedding photography management app.
      Your task is to extract structural booking data from natural language text.
      
      Current Date: ${today}

      Return a JSON object with:
      - clientName (string): Full name of the client.
      - clientPhone (string, optional): Phone number if present.
      - groomName (string, optional): Name of groom.
      - brideName (string, optional): Name of bride.
      - eventTitle (string): e.g., "Wedding", "Reception", "Haldi". Default to "Wedding Ceremony" if unclear.
      - startDate (string): YYYY-MM-DD format.
      - endDate (string): YYYY-MM-DD format. If single day, same as startDate.
      - venue (string): Location or venue name.
      - packageAmount (number): Total booking value.
      - advanceAmount (number): Amount paid upfront.
      - notes (string): Any extra details like "Cinematography only" or "Drone required".

      Rules:
      1. If the year is missing, assume the next occurrence of that date relative to ${today}.
      2. If "next week" or "tomorrow" is used, calculate the date based on ${today}.
    `;

    const response = await client.models.generateContent({
      model: model,
      contents: command,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clientName: { type: Type.STRING },
            clientPhone: { type: Type.STRING },
            groomName: { type: Type.STRING },
            brideName: { type: Type.STRING },
            eventTitle: { type: Type.STRING },
            startDate: { type: Type.STRING },
            endDate: { type: Type.STRING },
            venue: { type: Type.STRING },
            packageAmount: { type: Type.NUMBER },
            advanceAmount: { type: Type.NUMBER },
            notes: { type: Type.STRING },
          },
          required: ["clientName", "eventTitle", "startDate", "packageAmount"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const parsedData = JSON.parse(text);
    
    // Data sanitization
    if (!parsedData.endDate && parsedData.startDate) {
      parsedData.endDate = parsedData.startDate;
    }
    
    // Ensure endDate is not before startDate
    if (parsedData.startDate && parsedData.endDate && parsedData.endDate < parsedData.startDate) {
        parsedData.endDate = parsedData.startDate;
    }

    return createNewBooking(parsedData);

  } catch (error) {
    console.error("Error parsing command with Gemini:", error);
    return null;
  }
};
