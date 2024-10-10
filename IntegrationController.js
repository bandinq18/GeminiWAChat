const WhatsAppService = require('./src/WhatsAppService');
const GeminiService = require('./src/GeminiService');

const geminiService = new GeminiService();

// Fungsi ini akan digunakan untuk memproses pesan menggunakan GeminiService
async function handleMessage(message) {
    try {
        return await geminiService.sendMessage(message); // Dengan asumsi bahwa `sendMessage` mengembalikan jawaban secara langsung
    } catch (error) {
        console.error('Error in handleMessage:', error);
        return 'Erro ao processar sua mensagem.';
    }
}

// Meneruskan fungsi `handleMessage` ke WhatsAppService
const whatsappService = new WhatsAppService('gemini-session', handleMessage);
whatsappService.initialize();
