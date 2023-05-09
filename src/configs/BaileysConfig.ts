import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'

class BaileysConfig{

    async connect(){
        const { state, saveCreds } = await useMultiFileAuthState('./cache/auth/baileys')
        const bot = await makeWASocket({
            printQRInTerminal: true,
            defaultQueryTimeoutMs: undefined,
            auth: state,
        })

        this.onConnectionUpdate(bot)

        bot.ev.on('creds.update', saveCreds)
        return bot
    }

    private onConnectionUpdate(instance: any){
        instance.ev.on('connection.update', (update: any) =>{ 
            const { connection, lastDisconnect } = update
    
            // verifica se a conexão expirou
            if(connection === 'close')
            {    
                const shouldReconnect = (lastDisconnect!.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                if(shouldReconnect)
                {
                    this.connect()
                }else{
                    console.log('Não foi possível reconectar')  
                    this.connect()
                }
                
            }
        })
    }

}

export default BaileysConfig