/*
 _Este bot foi criado pelo Rony caso vá usar_
  ⚠️ _Não retire os créditos do canal_ ⚠️

                🌐 Canal 🌐

  Rony / Spectrum : https://youtube.com/@Spectrum_bots
*/

const pino = require('pino')
const readline = require('readline')

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚙️ CONFIGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

const prefix = '!'
let jaPareou = false

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚒️ FUNÇÕES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

const esperar = async (tempo) => {
    return new Promise(funcao => setTimeout(funcao, tempo));
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🤖 BOT E CONEXÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

async function ligarbot() {
    // Importacao dinamica para resolver o erro ERR_REQUIRE_ESM no Node v14 (iSH)
    const { 
        default: makeWASocket, 
        useMultiFileAuthState, 
        fetchLatestBaileysVersion, 
        Browsers, 
        DisconnectReason 
    } = await import('@whiskeysockets/baileys')

    const { state, saveCreds } = await useMultiFileAuthState('./sessao')
    const { version } = await fetchLatestBaileysVersion()

    const client = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: Browsers.ubuntu('Chrome'),
        printQRInTerminal: false
    })

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      ♻️ DADOS DA CONEXÃO
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    client.ev.on('creds.update', saveCreds)

    client.ev.on('chats.set', () => {
        console.log('Setando conversas...')
    })

    client.ev.on('contacts.set', () => {
        console.log('Setando contatos...')
    })

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      📧 MENSAGENS
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    client.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const info = messages[0]
            if (!info.message) return 
            if (info.key.fromMe) return

            const key = {
                remoteJid: info.key.remoteJid,
                id: info.key.id, 
                participant: info.key.participant 
            }
            await client.readMessages([key])
            if (info.key && info.key.remoteJid == 'status@broadcast') return

            const altpdf = Object.keys(info.message)
            const type = altpdf[0] == 'senderKeyDistributionMessage' ? altpdf[1] == 'messageContextInfo' ? altpdf[2] : altpdf[1] : altpdf[0]

            const body = (type === 'conversation') ?
            info.message.conversation : (type == 'imageMessage') ?
            info.message.imageMessage.caption : (type == 'videoMessage') ?
            info.message.videoMessage.caption : (type == 'extendedTextMessage') ?
            info.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ?
            info.message.buttonsResponseMessage.selectedButtonId : (info.message.listResponseMessage && info.message.listResponseMessage.singleSelectReply.selectedRowId.startsWith(prefix) && info.message.listResponseMessage.singleSelectReply.selectedRowId) ? info.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ?
            info.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (info.message.buttonsResponseMessage?.selectedButtonId || info.message.listResponseMessage?.singleSelectReply.selectedRowId || info.text) : ''

            const from = info.key.remoteJid
            const isCmd = body.startsWith(prefix)
            const comando = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null

            /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              🔰 FUNÇÕES DO BOT
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

            async function escrever (texto) {
                await client.sendPresenceUpdate('composing', from) 
                await esperar(1000)   
                client.sendMessage(from, { text: texto }, {quoted: info})
            }

            const enviar = (texto) => {
                client.sendMessage(from, { text: texto }, {quoted: info})
            }

            /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              🎮 COMANDOS
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

            switch(comando) {
                case 'escrever':
                    escrever('Ola, estou escrevendo como humano')
                    break

                case 'responda':
                    enviar('Ola')
                    break

                case 'menu':
                    const menu = `
╔═══════════════════╗
   🥶 Miragem BOT 🥶
╚═══════════════════╝

✨ 𝙈𝙀𝙉𝙐 𝘿𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 ✨

📌 ┃ INFORMAÇÕES
┃ ➤ ${prefix}menu
┃ ➤ ${prefix}ping
┃ ➤ ${prefix}info
┃ ➤ ${prefix}dono

════════════════
📌 Prefixo: ${prefix}
👨‍‍💻 Criador: Rony
⚡ Versão: 2.0.0
════════════════
`
                    escrever(menu)
                    break

                case 'ping':
                    enviar(`🏓 Pong`)
                    break

                case 'info':
                    const infoBot = `
╔═ 🤖 INFO BOT 🤖 ══╗
║
║ 🤖 Nome: Miragem BOT
║ ⚡ Versão: 2.0.0
║ 👨‍💻 Criador: Rony
║ 🧠 Linguagem: Node.js
║ 📦 Biblioteca: Baileys
║
║ 📢 Canal: https://youtube.com/@Spectrum_bots
║
║ "Automatizando seu grupo ⚡"
║
╚═══════════════╝
`
                    escrever(infoBot)
                    break

                case 'dono':
                    const dono = `
╔═ 👑 DONO DO BOT 👑 ══╗
║
║ 👑 Nome: Rony (Spectrum)
║ 💻 Função: Desenvolvedor
║ 📺 YouTube: https://youtube.com/@Spectrum_bots
║
║ "Criador da máquina 🤖⚡"
║
╚══════════════════╝
`
                    escrever(dono)
                    break
            }

        } catch (erro) {
            console.log(erro)
        }
    })

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      🌐 CONEXÃO DO BOT
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    client.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update

        if (qr && !client.authState.creds.registered && !jaPareou) {
            jaPareou = true
            
            // Entrada manual ou padrão
            const Pergunta = await question('Aperte ENTER para usar seu numero (5531992810436) ou digite outro:\n')
            const Numero = Pergunta.replace(/[^0-9]/g, '') || '5531992810436'

            console.log(`\nSolicitando codigo para: ${Numero}...`)
            let codigo = await client.requestPairingCode(Numero)
            codigo = codigo?.match(/.{1,4}/g)?.join("-") || codigo
            console.log(`\n==================================`)
            console.log(`🔑 CODIGO DE PAREAMENTO: ${codigo}`)
            console.log(`==================================\n`)
        }
        
        if (connection === 'open') {
            console.log('✅ Bot conectado com sucesso!')
        }
        
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode
            console.log('❌ Conexão fechada. Código:', statusCode)

            if (statusCode !== DisconnectReason.loggedOut) {
                console.log('🔄 Reconectando sem refazer pairing...')
                ligarbot()
            } else {
                console.log('🚪 Deslogado. Apague a pasta sessao e pareie novamente.')
            }
        }
    })
}

ligarbot()
