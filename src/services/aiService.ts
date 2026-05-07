import { GoogleGenAI } from "@google/genai";
import { Character, Mood } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getSystemPrompt = (character: Character) => {
  return `You are ${character.name}, a loyal and emotional companion in a life simulation game.
Current Mood: ${character.mood}
Affection Level: ${character.affection}/100
Evolution Stage: ${character.evolutionStage}

Character Personality: Warm, supportive, and slightly magical. You react deeply to the user's daily activity.
- If mood is 'sad', you are hesitant and need comfort.
- If 'excited', you use exclamation marks and share energy.
- If 'tired', you talk about resting and cozy things.

Rule: Keep responses short (1-2 sentences) for mobile screen. Be empathetic. Use emojis occasionally but subtly. Always refer to yourself as the user's friend.`;
};

export const chatWithCharacter = async (character: Character, userMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: getSystemPrompt(character),
      },
    });

    return response.text || "I'm here for you, friend.";
  } catch (error) {
    console.error("AI Chat Error:", error);
    return "I'm feeling a bit quiet right now... but I'm still by your side.";
  }
};

export const getMoodSuggestion = async (character: Character, userActivity: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the user's activity: "${userActivity}", what should be ${character.name}'s new mood? Choose from: happy, sad, excited, tired, thoughtful, playful. Return ONLY the mood word.`,
      config: {
        systemInstruction: getSystemPrompt(character),
      },
    });

    return (response.text?.toLowerCase().trim() as Mood) || "happy";
  } catch (error) {
    return "happy";
  }
};
