## 📖 Ikhtisar

Proyek ini mengintegrasikan Google Generative AI (GeminiService) dengan Venom Bot (WhatsAppService) untuk membuat chatbot untuk WhatsApp. Bot ini menggunakan kecerdasan buatan generatif Google untuk memproses dan merespons pesan.

## 🛠️ Konfigurasi

1. **Variabel Lingkungan**:
      - Pastikan Anda memiliki file `.env` dengan file `GEMINI_API_KEY`.
      ```
      GEMINI_API_KEY=KODE_API_KEY
      ```

2. **Ketergantungan**:
      - Instal paket-paket yang diperlukan dengan menggunakan npm:
      ```sh
      npm install dotenv @google/generative-ai venom-bot
      ```

## 🤖 GeminiService

Kelas `GeminiService` bertanggung jawab untuk berkomunikasi dengan Google Generative AI API untuk menghasilkan respons berbasis teks.

###Kode Kelas

```javascript
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
            systemInstruction: "",
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
            console.error("Problema ao enviar a mensagem:", error);
            throw error;
        }
    }
}

module.exports = GeminiService;
```

## 🔍 Penjelasan Rinci

#### 1. Memuat Variabel Lingkungan 🌿

```javascript
require('dotenv').config();
```

- Muat variabel lingkungan dari file `.env`.

#### 2. Mengimpor Modul 📦

```javascript
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold
} = require("@google/generative-ai");
```

- Impor kelas dan enumerasi yang diperlukan dari paket `@google/generative-ai`.

#### 3. Mendefinisikan Kelas `GeminiService` 🛠️

```javascript
class GeminiService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.modelConfig = {
            model: "gemini-1.5-pro-latest",
            systemInstruction: "", // Contoh pertanyaan awal: "Anda adalah seorang model yang menjawab pertanyaan tentang toko buku saya"
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
            console.error("Problema ao enviar a mensagem:", error);
            throw error;
        }
    }
}
```

##### **`constructor()`** 🏗️

- **`apiKey`**: Mendapat kunci API dari berkas `.env`.- **`this.genAI`**: Menginisialisasi instans Google Generative AI dengan kunci API.
- **`this.modelConfig`**: Mengonfigurasi model AI dan instruksi sistem untuk menghasilkan respons dengan nada yang diinginkan.
- ** ` this.generationConfig ` **: Pengaturan pembangkitan seperti temperatur, topP, topK, dan parameter penyetelan lainnya untuk output teks.
- **`this.safetySettings`**: Setelan keamanan untuk menentukan cara AI menangani konten berbahaya.

##### **`async startChat()`** 🚀

```javascript
async startChat() {
    this.chatSession = await this.genAI.getGenerativeModel(this.modelConfig).startChat({
        generationConfig: this.generationConfig,
        safetySettings: this.safetySettings,
        history: [],
    });
}
```

- Menginisialisasi sesi obrolan baru dengan konfigurasi yang ditentukan.

##### **`async sendMessage(message)`** ✉️

```javascript
async sendMessage(message) {
    try {
        if (!this.chatSession) {
            await this.startChat();
        }
        const result = await this.chatSession.sendMessage(message);
        return result.response.text();
    } catch (error) {
        console.error("Problema ao enviar a mensagem:", error);
        throw error;
    }
}
```

- Mengirim pesan ke sesi obrolan dan mengembalikan respons yang dihasilkan.

## 📱 WhatsAppService

Kelas `WhatsAppService` mengelola interaksi dengan Bot Venom untuk mengirim dan menerima pesan di WhatsApp.

### Kode Kelas

```javascript
const venom = require('venom-bot');

class WhatsAppService {
    constructor(sessionName, messageHandler) {
        this.sessionName = sessionName;
        this.client = null;
        this.messageHandler = messageHandler;  // Handler untuk memproses pesan masuk
    }

    async initialize() {
        try {
            this.client = await venom.create({
                session: this.sessionName,
            });
            this.listenSingleContatcMenssage();
        } catch (error) {
            console.error('Erro a iniciar o cliente venom: ', error);
        }
    }

    listenToMessages() {
        this.client.onMessage(async (message) => {
            if (!message.isGroupMsg) {  // Mengabaikan pesan grup, jika perlu
                try {
                    const reply = await this.messageHandler(message.body);  // Menggunakan handler eksternal untuk mendapatkan jawabannya
                    this.client.sendText(message.from, reply)
                        .then((result) => {
                            console.log('Mensagem enviada: ', result);
                        })
                        .catch((error) => {
                            console.error('Erro enviando a mensagem: ', error);
                        });
                } catch (error) {
                    console.error('Erro ao tratar a mensagem: ', error);
                    await this.client.sendText(message.from, 'Desculpe, ocorreu um erro ao processar sua mensagem.');
                }
            }
        });
    }
    listenSingleContatcMenssage() {
        this.client.onMessage(async (message) => {
            if (!message.isGroupMsg && message.from === '55xxxxxxxxxxx@c.us') { // Memeriksa apakah pengirim adalah kontak yang diinginkan // Masukkan nomor dan dd
                try {
                    const reply = await this.messageHandler(message.body); // Menggunakan handler eksternal untuk mendapatkan jawabannya
                    this.client.sendText(message.from, reply)
                        .then((result) => {
                            console.log('Mensagem enviada: ', result);
                        })
                        .catch((error) => {
                            console.error('Erro ao enviar a mensagem:', error);
                        });
                } catch (error) {
                    console.error('Erro ao tratar a mensagem: ', error);
                }
            }
        });
    }
}

module.exports = WhatsAppService;
```

### 🔍 Penjelasan Rinci

#### Konstruktor 🏗️

```javascript
constructor(sessionName, messageHandler) {
    this.sessionName = sessionName;
    this.client = null;
    this.messageHandler = messageHandler;  // Handler untuk memproses pesan masuk
}
```

- **`sessionName`**: Nama sesi Venom Bot.

- ** ` pengelolaPesan ` **: Fungsi untuk memproses pesan yang masuk.

#### Menginisialisasi Klien 🚀

```javascript
async initialize() {
    try {
        this.client = await venom.create({
            session: this.sessionName,
        });
        this.listenSingleContatcMenssage();
    } catch (error) {
        console.error('Erro a iniciar o cliente venom: ', error);
    }
}
```

- Menginisialisasi klien Venom Bot dan mulai mendengarkan pesan dari kontak tertentu.

#### Mendengarkan Pesan dari Kontak Tertentu 👂

```javascript
listenSingleContatcMenssage() {
    this.client.onMessage(async (message) => {
        if (!message.isGroupMsg && message.from === '62xxxxxxxxxxx@c.us') { // Memeriksa apakah pengirim adalah kontak yang diinginkan // Masukkan nomor dan dd
            try {
                const reply = await this.messageHandler(message.body);  // Menggunakan handler eksternal untuk mendapatkan jawabannya
                this.client.sendText(message.from, reply)
                    .then((result) => {
                        console.log('Mensagem enviada: ', result);
                    })
                    .catch((error) => {
                        console.error('Erro ao enviar a mensagem:', error);
                    });
            } catch (error) {
                console.error('Erro ao tratar a mensagem: ', error);
            }
        }
    });
}
```

- Mendengarkan pesan dari kontak tertentu dan memproses respons menggunakan `pengelola pesan`.

## 🌐 Integrasi

Mengintegrasikan `GeminiService` dan `WhatsAppService` untuk memproses dan merespons pesan yang masuk.

## Kode Integrasi

```javascript
const WhatsAppService = require('./src/WhatsAppService');
const GeminiService = require('./src/GeminiService');

const geminiService = new GeminiService();

// Fungsi ini akan digunakan untuk memproses pesan menggunakan GeminiService
async function handleMessage(message) {
    try {
        return await geminiService.sendMessage(message); // Dengan asumsi `sendMessage` mengembalikan jawaban secara langsung
    } catch (error) {
        console.error('Error in handleMessage:', error);
        return 'Erro ao processar sua mensagem.';
    }
}

// Meneruskan fungsi `handleMessage` ke WhatsAppService
const whatsappService = new WhatsAppService('gemini-session', handleMessage);
whatsappService.initialize();
```

### 🔍 Penjelasan Rinci

#### Inisialisasi Layanan 🚀

```javascript
const geminiService = new GeminiService();
```

- Menginisialisasi layanan `GeminiService`.

#### Fungsi `handleMessage` 📨

```javascript
async function handleMessage(message) {
    try {
        return await geminiService.sendMessage(message); // Dengan asumsi `sendMessage` mengembalikan jawaban secara langsung
    } catch (error) {
        console.error('Error in handleMessage:', error);
        return 'Erro ao processar sua mensagem.';
    }
}
```

- Mendefinisikan fungsi untuk memproses pesan masuk menggunakan `GeminiService`.

#### Inisialisasi `WhatsAppService` 📱

```javascript
const whatsappService = new WhatsAppService('gemini-session', handleMessage);
whatsappService.initialize();
```

- Menginisialisasi `WhatsAppService` dan mulai mendengarkan pesan, memprosesnya dengan fungsi `handleMessage`.

## 🏃‍♂️ Menjalankan Proyek

1. **Start WhatsAppService**:
- Memulai layanan Venom Bot dengan fungsi `handleMessage` untuk memproses pesan yang masuk.
      ```sh
      node IntegrationController.js
      ```

2. **Berinteraksi dengan bot**:
- Kirim pesan ke bot di WhatsApp dan bot akan membalas menggunakan Google Generative AI yang telah dikonfigurasi.
