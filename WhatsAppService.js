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
            console.error('Kesalahan saat memulai klien: ', error);
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
                    console.error('Erro ao tratar a mensagem: ', error);
                    await this.client.sendText(message.from, 'Desculpe, ocorreu um erro ao processar sua mensagem.');
                }
            }
        });
    }
    listenSingleContatcMenssage() {
        this.client.onMessage(async (message) => {
            if (!message.isGroupMsg && message.from === '55xxxxxxxxxxx@c.us') { // Checando se o remetente é o contato desejado
                try {
                    const reply = await this.messageHandler(message.body);  // Usando o handler externo para obter a resposta
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
