
import { GoogleGenAI, Type } from "@google/genai";
import { Booking } from "../types";
import { createNewBooking } from "./storageService";

// Initialize Gemini
// Note: In a real production app, ensure this key is guarded.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseBookingCommand = async (command: string): Promise<Booking | null> => {
  try {
    const model = "gemini-2.5-flash";
    const today = new Date().toISOString().split('T')[0];
    const systemInstruction = `
      You are an assistant for a wedding photographer app called "ShootSync".
      Your task is to extract booking details from natural language text.
      Return a JSON object with the following fields:
      - clientName (string)
      - clientPhone (string, optional)
      - groomName (string, optional)
      - brideName (string, optional)
      - eventTitle (string, e.g., Wedding, Reception)
      - startDate (string, YYYY-MM-DD format). If only one date is mentioned, this is the date.
      - endDate (string, YYYY-MM-DD format). If the event is multiple days (e.g. "from 12th to 14th"), set this to the last day. If single day, set equal to startDate.
      - venue (string)
      - packageAmount (number)
      - advanceAmount (number)
      - notes (string)

      If information is missing, use reasonable defaults or leave empty/0.
      Today's date is ${today}.
    `;

    const response = await ai.models.generateContent({
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
    // Ensure endDate is at least startDate
    if (!parsedData.endDate && parsedData.startDate) {
      parsedData.endDate = parsedData.startDate;
    }
    return createNewBooking(parsedData);

  } catch (error) {
    console.error("Error parsing command with Gemini:", error);
    return null;
  }
};
