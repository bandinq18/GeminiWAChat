require('dotenv').config();

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold
} = require("@google/generative-ai");

class GeminiService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.modelConfig = {
            model: "gemini-1.5-pro-latest",
            systemInstruction: "Selalu jawab pertanyaan dalam bahasa Indonesia, dan jawablah secara umum meskipun pengguna tidak menyebutkan secara detail tentang topik tersebut." //Konteks yang harus ditambahkan untuk fungsi tertentu
        };
        this.generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 500000,
            responseMimeType: "text/plain",
        };
        this.safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ];
    }

    async startChat() {
        this.chatSession = await this.genAI.getGenerativeModel(this.modelConfig).startChat({
            generationConfig: this.generationConfig,
            safetySettings: this.safetySettings,
            history: [],
        });
    }

    async sendMessage(message) {
        try {
            if (!this.chatSession) {
                await this.startChat();
            }
            const result = await this.chatSession.sendMessage(message);
            return result.response.text();
        } catch (error) {
            console.error("Masalah saat mengirim pesan:", error);
            throw error;
        }
    }
}


module.exports = GeminiService;
