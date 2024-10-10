const venom = require('venom-bot');

class WhatsAppService {
    constructor(sessionName, messageHandler) {
        this.sessionName = sessionName;
        this.client = null;
        this.messageHandler = messageHandler; // Penangan untuk memproses pesan masuk
    }

    async initialize() {
        try {
            this.client = await venom.create({
                session: this.sessionName,
            });
            this.listenSingleContatcMenssage();
        } catch (error) {
            console.error('Kesalahan saat memulai klien venom: ', error);
        }
    }

    listenToMessages() {
        this.client.onMessage(async (message) => {
            if (!message.isGroupMsg) {  // Mengabaikan pesan grup, jika perlu
                try {
                    const reply = await this.messageHandler(message.body);  // Menggunakan penangan eksternal untuk mendapatkan jawabannya
                    this.client.sendText(message.from, reply)
                        .then((result) => {
                            console.log('Pesan terkirim: ', result);
                        })
                        .catch((error) => {
                            console.error('Kesalahan pengiriman pesan: ', error);
                        });
                } catch (error) {
                    console.error('Kesalahan dalam menangani pesan: ', error);
                    await this.client.sendText(message.from, 'Maaf, ada kesalahan dalam memproses pesan Anda.');
                }
            }
        });
    }
    listenSingleContatcMenssage() {
        this.client.onMessage(async (message) => {
            if (!message.isGroupMsg && message.from === '62xxxxxxxxxxx@c.us') { // Memeriksa apakah pengirim adalah kontak yang diinginkan
                try {
                    const reply = await this.messageHandler(message.body);  // Menggunakan handler eksternal untuk mendapatkan jawabannya
                    this.client.sendText(message.from, reply)
                        .then((result) => {
                            console.log('Pesan terkirim: ', result);
                        })
                        .catch((error) => {
                            console.error('Kesalahan pengiriman pesan:', error);
                        });
                } catch (error) {
                    console.error('Kesalahan dalam menangani pesan: ', error);
                }
            }
        });
    }
}

module.exports = WhatsAppService;
