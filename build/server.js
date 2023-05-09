"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const io_1 = require("./services/io");
const port = process.env.PORT || 8080;
const moment_1 = __importDefault(require("moment"));
const Message_1 = __importDefault(require("./models/Message"));
const MongoConfig_1 = __importDefault(require("./configs/MongoConfig"));
const api_1 = __importDefault(require("./routes/api"));
const BaileysConfig_1 = __importDefault(require("./configs/BaileysConfig"));
io_1.app.use('/api', api_1.default);
// console.log(`data:image/jpeg;base64,${base64Image}`)
function init() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const baileys = new BaileysConfig_1.default();
        const bot = yield baileys.connect();
        const myJid = yield ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.id);
        io_1.io.on('connection', (socket) => {
            socket.on('messages', (data) => __awaiter(this, void 0, void 0, function* () {
                const { remoteJid, message } = data;
                try {
                    yield bot.sendMessage(remoteJid, { text: message });
                }
                catch (e) {
                    console.log(e.message);
                }
            }));
            console.log(`Socket conectado: ${socket.id}`);
        });
        // console.log(myJid)
        function getImageUser(jid) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const profilePicture = yield bot.profilePictureUrl(jid);
                    resolve(profilePicture);
                }
                catch (error) {
                    return null;
                }
            }));
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
        bot.ev.on('messages.upsert', (messages) => __awaiter(this, void 0, void 0, function* () {
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
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27;
            // const getUser = await getInformationUser('5511932140565@s.whatsapp.net')        
            try {
                // Verifica se a mensagem foi apagada
                const messageIsErased = ((_c = (_b = messages.messages[0].message) === null || _b === void 0 ? void 0 : _b.protocolMessage) === null || _c === void 0 ? void 0 : _c.type) === 0;
                // Verifica se a mensagem é uma resposta de status
                const isMessageFromStatus = ((_f = (_e = (_d = messages.messages[0].message) === null || _d === void 0 ? void 0 : _d.extendedTextMessage) === null || _e === void 0 ? void 0 : _e.contextInfo) === null || _f === void 0 ? void 0 : _f.remoteJid) == 'status@broadcast' || null;
                // verifica se a mensagem é uma resposta a outra mensagem
                const isMessageFromResponse = ((_h = (_g = messages.messages[0].message) === null || _g === void 0 ? void 0 : _g.extendedTextMessage) === null || _h === void 0 ? void 0 : _h.text) && ((_l = (_k = (_j = messages.messages[0].message) === null || _j === void 0 ? void 0 : _j.extendedTextMessage) === null || _k === void 0 ? void 0 : _k.contextInfo) === null || _l === void 0 ? void 0 : _l.quotedMessage) || null;
                const isAudioMessage = ((_m = messages.messages[0].message) === null || _m === void 0 ? void 0 : _m.audioMessage) || null;
                const isAudioMessageResponse = ((_r = (_q = (_p = (_o = messages.messages[0].message) === null || _o === void 0 ? void 0 : _o.extendedTextMessage) === null || _p === void 0 ? void 0 : _p.contextInfo) === null || _q === void 0 ? void 0 : _q.quotedMessage) === null || _r === void 0 ? void 0 : _r.audioMessage) || null;
                const audioSeconds = isAudioMessage ? moment_1.default.utc(moment_1.default.duration((_t = (_s = messages.messages[0].message) === null || _s === void 0 ? void 0 : _s.audioMessage) === null || _t === void 0 ? void 0 : _t.seconds, 'seconds').as('milliseconds')).format('mm:ss') : null;
                if (messageIsErased) {
                    const findMessageToBeDeleted = yield Message_1.default
                        .findOne({ idMessage: (_w = (_v = (_u = messages.messages[0].message) === null || _u === void 0 ? void 0 : _u.protocolMessage) === null || _v === void 0 ? void 0 : _v.key) === null || _w === void 0 ? void 0 : _w.id,
                        remoteJid: messages.messages[0].key.remoteJid });
                    if (findMessageToBeDeleted) {
                        const deleteMessage = yield Message_1.default.deleteOne({ _id: findMessageToBeDeleted._id });
                        if (deleteMessage) {
                            const getMessagesFromUser = yield Message_1.default.find({ remoteJid: messages.messages[0].key.remoteJid });
                            io_1.io.emit('messages', getMessagesFromUser);
                        }
                    }
                }
                else if (isMessageFromResponse && !isMessageFromStatus) {
                    const profilePicture = yield getImageUser(messages.messages[0].key.remoteJid);
                    const isAudioMessageResponseSeconds = isAudioMessageResponse ? moment_1.default.utc(moment_1.default.duration((_1 = (_0 = (_z = (_y = (_x = messages.messages[0].message) === null || _x === void 0 ? void 0 : _x.extendedTextMessage) === null || _y === void 0 ? void 0 : _y.contextInfo) === null || _z === void 0 ? void 0 : _z.quotedMessage) === null || _0 === void 0 ? void 0 : _0.audioMessage) === null || _1 === void 0 ? void 0 : _1.seconds, 'seconds').as('milliseconds')).format('mm:ss') : null;
                    const quotedMessage = ((_6 = (_5 = (_4 = (_3 = (_2 = messages.messages[0].message) === null || _2 === void 0 ? void 0 : _2.extendedTextMessage) === null || _3 === void 0 ? void 0 : _3.contextInfo) === null || _4 === void 0 ? void 0 : _4.quotedMessage) === null || _5 === void 0 ? void 0 : _5.extendedTextMessage) === null || _6 === void 0 ? void 0 : _6.text) || ((_10 = (_9 = (_8 = (_7 = messages.messages[0].message) === null || _7 === void 0 ? void 0 : _7.extendedTextMessage) === null || _8 === void 0 ? void 0 : _8.contextInfo) === null || _9 === void 0 ? void 0 : _9.quotedMessage) === null || _10 === void 0 ? void 0 : _10.conversation);
                    const setMessage = yield Message_1.default.insertMany({
                        remoteJid: messages.messages[0].key.remoteJid,
                        fromMe: messages.messages[0].key.fromMe,
                        idMessage: (_11 = messages.messages[0].key) === null || _11 === void 0 ? void 0 : _11.id,
                        username: null,
                        MessageText: isAudioMessage ?
                            `Mensagem de audio (${audioSeconds})` :
                            (_13 = (_12 = messages.messages[0].message) === null || _12 === void 0 ? void 0 : _12.extendedTextMessage) === null || _13 === void 0 ? void 0 : _13.text,
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
                                `Mensagem de audio (${isAudioMessageResponseSeconds})` : quotedMessage,
                        },
                        isMessageFromImage: false
                    });
                    if (setMessage) {
                        const getMessagesFromUser = yield Message_1.default.find();
                        io_1.io.emit('messages', getMessagesFromUser);
                    }
                }
                else if (isMessageFromStatus) {
                    const profilePicture = yield getImageUser(messages.messages[0].key.remoteJid);
                    function extractThumbnailFromHex(hex) {
                        const buffer = Buffer.from(hex, 'hex').toString('base64');
                        return `data:image/jpeg;base64,${buffer}`;
                    }
                    const setMessage = yield Message_1.default.insertMany({
                        remoteJid: messages.messages[0].key.remoteJid,
                        fromMe: messages.messages[0].key.fromMe,
                        idMessage: (_14 = messages.messages[0].key) === null || _14 === void 0 ? void 0 : _14.id,
                        username: null,
                        MessageText: isAudioMessage ? `Mensagem de audio (${audioSeconds})` : (_15 = messages.messages[0].message) === null || _15 === void 0 ? void 0 : _15.conversation,
                        profilePicture: profilePicture ? profilePicture : null,
                        messageTimestamp: messages.messages[0].messageTimestamp,
                        isMessageFromResponse: {
                            isFromResponse: false,
                            text: null,
                        },
                        isMessageFromStatus: {
                            isFromStatus: true,
                            text: (_17 = (_16 = messages.messages[0].message) === null || _16 === void 0 ? void 0 : _16.extendedTextMessage) === null || _17 === void 0 ? void 0 : _17.text,
                            thumbnail: extractThumbnailFromHex((_22 = (_21 = (_20 = (_19 = (_18 = messages.messages[0].message) === null || _18 === void 0 ? void 0 : _18.extendedTextMessage) === null || _19 === void 0 ? void 0 : _19.contextInfo) === null || _20 === void 0 ? void 0 : _20.quotedMessage) === null || _21 === void 0 ? void 0 : _21.imageMessage) === null || _22 === void 0 ? void 0 : _22.jpegThumbnail),
                        },
                        isMessageFromImage: false
                    });
                    if (setMessage) {
                        const getMessagesFromUser = yield Message_1.default.find();
                        io_1.io.emit('messages', getMessagesFromUser);
                    }
                    // Verifica se a mensagem foi enviada pela api
                }
                else if (messages.type == 'append') {
                    const profilePicture = yield getImageUser(messages.messages[0].key.remoteJid);
                    const setMessage = yield Message_1.default.insertMany({
                        remoteJid: messages.messages[0].key.remoteJid,
                        fromMe: messages.messages[0].key.fromMe,
                        idMessage: (_23 = messages.messages[0].key) === null || _23 === void 0 ? void 0 : _23.id,
                        username: null,
                        MessageText: isAudioMessage ? `Mensagem de audio (${audioSeconds})` : (_25 = (_24 = messages.messages[0].message) === null || _24 === void 0 ? void 0 : _24.extendedTextMessage) === null || _25 === void 0 ? void 0 : _25.text,
                        profilePicture: profilePicture ? profilePicture : null,
                        messageTimestamp: messages.messages[0].messageTimestamp,
                        isMessageFromStatus: false,
                        isMessageFromResponse: false,
                        isMessageFromImage: false
                    });
                    if (setMessage) {
                        const getMessagesFromUser = yield Message_1.default.find();
                        io_1.io.emit('messages', getMessagesFromUser);
                    }
                }
                else {
                    const profilePicture = yield getImageUser(messages.messages[0].key.remoteJid);
                    const setMessage = yield Message_1.default.insertMany({
                        remoteJid: messages.messages[0].key.remoteJid,
                        fromMe: messages.messages[0].key.fromMe,
                        idMessage: (_26 = messages.messages[0].key) === null || _26 === void 0 ? void 0 : _26.id,
                        username: null,
                        MessageText: isAudioMessage ? `Mensagem de audio (${audioSeconds})` : (_27 = messages.messages[0].message) === null || _27 === void 0 ? void 0 : _27.conversation,
                        profilePicture: profilePicture ? profilePicture : null,
                        messageTimestamp: messages.messages[0].messageTimestamp,
                        isMessageFromStatus: false,
                        isMessageFromResponse: false,
                        isMessageFromImage: false
                    });
                    if (setMessage) {
                        const getMessagesFromUser = yield Message_1.default.find();
                        io_1.io.emit('messages', getMessagesFromUser);
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        }));
    });
}
init();
// run in main file
MongoConfig_1.default.connect()
    .then(() => {
    console.log('Database connected');
})
    .catch((err) => {
    console.log(err);
});
io_1.serverHttp.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
