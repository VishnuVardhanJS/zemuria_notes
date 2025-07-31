import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini_api_key = import.meta.env.VITE_GEMINI_API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
    model: "models/gemini-1.5-flash",
    geminiConfig,
});

export const generateContent = async (input) => {
    try {
        const prompt = input;
        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        return response.text()
    } catch (error) {
        console.log("response error", error);
    }
};


export const summarizeContent = async (input) => {
    const prompt = input + "\n\n" + "Summarize this as short as possible if it is already short enough give the same text back";

    const result = await generateContent(prompt);

    return result;
}

export const grammarCorrection = async (input) => {
    const prompt = input + "\n\n" + "Fix Grammar in this and if the grammar is correct return the input text itself DO NOT GIVE THE GRAMMAR IS ALREADY CORRECT";

    const result = await generateContent(prompt);

    return result;
}

export const getPromts = async (input) => {
    const prompt = input + "\n\n" + "if this is a prompt give the result for the prompt else make this content as formal as possible";

    const result = await generateContent(prompt);

    return result;
}