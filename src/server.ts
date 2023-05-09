import 'dotenv/config'
import { serverHttp, io, app } from './services/io'
const port = process.env.PORT || 8080
import moment from 'moment'
import Message from './models/Message'
import database from './configs/MongoConfig'
import apiRoutes from './routes/api'
import BaileysConfig from './configs/BaileysConfig'

app.use('/api', apiRoutes)


// console.log(`data:image/jpeg;base64,${base64Image}`)


async function init()
{
    const baileys = new BaileysConfig()
    const bot = await baileys.connect()
    const myJid = await bot.user?.id

    io.on('connection', (socket) => {
        socket.on('messages', async (data) => {
            const { remoteJid, message } = data
            try {
                await bot.sendMessage(remoteJid, { text: message })

            } catch (e: any) {
                console.log(e.message)
            }
        })
        console.log(`Socket conectado: ${socket.id}`)
    })

    // console.log(myJid)

    function getImageUser(jid: string){
        return new Promise(async (resolve, reject) => {
            try {
                const profilePicture = await bot.profilePictureUrl(jid)
                resolve(profilePicture)
            } catch (error) {
                return null
            }
        })
    }

    // function getInformationUser(jid: string){
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const informationUser = await bot.getBusinessProfile(jid)
    //             resolve(informationUser)
    //         } catch (error) {
    //             return null
    //         }
    //     })
    // }

    bot.ev.on('messages.upsert', async (messages) => {
        // console.log(messages)
        // console.log("\n---\n")
        // console.log(messages.messages[0].message)
        // console.log("\n---\n")
        // console.log(messages.messages[0].key)
        // console.log("\n---\n")
        // console.log(messages.messages[0].message?.audioMessage)
        // console.log("\n---\n")
        // console.log(messages.messages[0].message?.extendedTextMessage?.contextInfo?.quotedMessage)
        // // console.log("\n---\n")
        // // console.log("Outra mensagem")
        // console.log("\n---\n")
    
        // const getUser = await getInformationUser('5511932140565@s.whatsapp.net')        

        try {
            // Verifica se a mensagem foi apagada
            const messageIsErased = messages.messages[0].message?.protocolMessage?.type === 0
            
            // Verifica se a mensagem é uma resposta de status
            const isMessageFromStatus = messages.messages[0].message?.extendedTextMessage?.contextInfo?.remoteJid == 'status@broadcast' || null

            // verifica se a mensagem é uma resposta a outra mensagem
            const isMessageFromResponse = messages.messages[0].message?.extendedTextMessage?.text && messages.messages[0].message?.extendedTextMessage?.contextInfo?.quotedMessage || null
            const isAudioMessage = messages.messages[0].message?.audioMessage || null
            const isAudioMessageResponse = messages.messages[0].message?.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage || null
            const audioSeconds = isAudioMessage ? moment.utc(moment.duration(messages.messages[0].message?.audioMessage?.seconds,'seconds').as('milliseconds')).format('mm:ss') : null


            if(messageIsErased){
                const findMessageToBeDeleted = await Message
                    .findOne({  idMessage: messages.messages[0].message?.protocolMessage?.key?.id, 
                                remoteJid: messages.messages[0].key.remoteJid })

                if(findMessageToBeDeleted){
                    const deleteMessage = await Message.deleteOne({ _id: findMessageToBeDeleted._id })
                    if(deleteMessage){
                        const getMessagesFromUser = await Message.find({ remoteJid: messages.messages[0].key.remoteJid })
                        io.emit('messages', getMessagesFromUser)
                    }
                }
            }else if(isMessageFromResponse && !isMessageFromStatus)
            {
                const profilePicture = await getImageUser(messages.messages[0].key.remoteJid as string)
                const isAudioMessageResponseSeconds = isAudioMessageResponse ? moment.utc(moment.duration(messages.messages[0].message?.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage?.seconds,'seconds').as('milliseconds')).format('mm:ss') : null
                const quotedMessage = messages.messages[0].message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text || messages.messages[0].message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation

                const setMessage = await Message.insertMany({
                    remoteJid: messages.messages[0].key.remoteJid,
                    fromMe: messages.messages[0].key.fromMe,
                    idMessage: messages.messages[0].key?.id,
                    username: null, //messages.messages[0].pushName,
                    MessageText: isAudioMessage ? 
                        `Mensagem de audio (${audioSeconds})` : 
                        messages.messages[0].message?.extendedTextMessage?.text,

                    profilePicture: profilePicture ? profilePicture : null,
                    messageTimestamp: messages.messages[0].messageTimestamp,
                    isMessageFromStatus: {
                        isFromStatus: true,
                        text: null,
                        image: null,
                    },
                    isMessageFromResponse: {
                        isFromResponse: true,
                        text: isAudioMessageResponse ? 
                            `Mensagem de audio (${isAudioMessageResponseSeconds})` :  quotedMessage,
                    },
                    isMessageFromImage: false
                })
                
                if(setMessage){
                    const getMessagesFromUser = await Message.find()
                    io.emit('messages', getMessagesFromUser)
                }
            }else if(isMessageFromStatus){
                const profilePicture = await getImageUser(messages.messages[0].key.remoteJid as string)
                
                function extractThumbnailFromHex(hex: any) {
                    const buffer = Buffer.from(hex, 'hex').toString('base64')
                    return `data:image/jpeg;base64,${buffer}`
                }

                const setMessage = await Message.insertMany({
                    remoteJid: messages.messages[0].key.remoteJid,
                    fromMe: messages.messages[0].key.fromMe,
                    idMessage: messages.messages[0].key?.id,
                    username: null, //messages.messages[0].pushName,
                    MessageText: isAudioMessage ? `Mensagem de audio (${audioSeconds})` : messages.messages[0].message?.conversation,
                    profilePicture: profilePicture ? profilePicture : null,
                    messageTimestamp: messages.messages[0].messageTimestamp,
                    isMessageFromResponse: {
                        isFromResponse: false,
                        text: null,
                    },
                    isMessageFromStatus: {
                        isFromStatus: true,
                        text: messages.messages[0].message?.extendedTextMessage?.text,
                        thumbnail: extractThumbnailFromHex(messages.messages[0].message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.jpegThumbnail),
                    },
                    isMessageFromImage: false
                })
                
                if(setMessage){
                    const getMessagesFromUser = await Message.find()
                    io.emit('messages', getMessagesFromUser)
                }

            // Verifica se a mensagem foi enviada pela api
            }else if(messages.type == 'append'){
                const profilePicture = await getImageUser(messages.messages[0].key.remoteJid as string)
                const setMessage = await Message.insertMany({
                    remoteJid: messages.messages[0].key.remoteJid,
                    fromMe: messages.messages[0].key.fromMe,
                    idMessage: messages.messages[0].key?.id,
                    username: null, //messages.messages[0].pushName,
                    MessageText: isAudioMessage ? `Mensagem de audio (${audioSeconds})` : messages.messages[0].message?.extendedTextMessage?.text,
                    profilePicture: profilePicture ? profilePicture : null,
                    messageTimestamp: messages.messages[0].messageTimestamp,
                    isMessageFromStatus: false,
                    isMessageFromResponse: false,
                    isMessageFromImage: false
                })
                
                if(setMessage){
                    const getMessagesFromUser = await Message.find()
                    io.emit('messages', getMessagesFromUser)
                }
            }
            else{
                const profilePicture = await getImageUser(messages.messages[0].key.remoteJid as string)
                const setMessage = await Message.insertMany({
                    remoteJid: messages.messages[0].key.remoteJid,
                    fromMe: messages.messages[0].key.fromMe,
                    idMessage: messages.messages[0].key?.id,
                    username: null, //messages.messages[0].pushName,
                    MessageText: isAudioMessage ? `Mensagem de audio (${audioSeconds})` : messages.messages[0].message?.conversation,
                    profilePicture: profilePicture ? profilePicture : null,
                    messageTimestamp: messages.messages[0].messageTimestamp,
                    isMessageFromStatus: false,
                    isMessageFromResponse: false,
                    isMessageFromImage: false
                })
                
                if(setMessage){
                    const getMessagesFromUser = await Message.find()
                    io.emit('messages', getMessagesFromUser)
                }
            }
        } catch (e: any) {
            console.log(e)            
        }
    })

    // Toda vez que um contato envia uma mensagem

    // bot.ev.on('contacts.upsert', (contacts) => {
    //     console.log({
    //         method: 'contacts.upsert'
    //     },contacts)
    // })
    
    // bot.ev.on('messaging-history.set', (messages) => {
    //     console.log({
    //         method: 'messaging-history.set'
    //     },messages, messages.contacts)
    // })

    // bot.ev.on('chats.update', (chats) => {
    //     console.log({
    //         method: 'chats.update'
    //     },chats)
    // })
    
    // Toda vez que um contato atualiza o status/nome etc...
    // bot.ev.on('contacts.update', (contacts) => {
    //     console.log({
    //         method: 'contacts.update'
    //     }, contacts)
    // })

    // bot.ev.on('blocklist.update', (blocklist) => {
    //     console.log({
    //         method: 'blocklist.update'
    //     },blocklist)
    // })

    // bot.ev.on('group-participants.update', (participants) => {
    //     console.log({
    //         method: 'group-participants.update'
    //     } ,participants)
    // })
}
init()
// run in main file

database.connect()
    .then(() => {
        console.log('Database connected')
    })
    .catch((err) => {
        console.log(err);
    })

serverHttp.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})