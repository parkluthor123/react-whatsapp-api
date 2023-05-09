"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoConfig_1 = __importDefault(require("../configs/MongoConfig"));
const { mongo } = MongoConfig_1.default;
const MessageSchema = new mongo.Schema({
    remoteJid: {
        type: String,
        required: true,
    },
    fromMe: {
        type: Boolean,
    },
    idMessage: {
        type: String,
    },
    username: {
        type: String,
    },
    MessageText: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    messageTimestamp: {
        type: Number
    },
    isMessageFromStatus: {
        isFromStatus: {
            type: Boolean
        },
        text: {
            type: String
        },
        thumbnail: {
            type: Array
        },
    },
    isMessageFromResponse: {
        isFromResponse: {
            type: Boolean
        },
        text: {
            type: String
        },
    },
    isMessageFromImage: {
        type: Boolean
    }
    // title:{
    //     type: String,
    //     required: true,
    // },
    // description:{
    //     type: String
    // },
    // partyDate:{
    //     type: Date
    // },
    // photos:{
    //     type: Array
    // },
    // privacy:{
    //     type: Boolean,
    // },
    // userId:{
    //     // @ts-ignore
    //     type: mongo.ObjectId,
    // }
});
const Message = mongo.model('Message', MessageSchema);
exports.default = Message;
