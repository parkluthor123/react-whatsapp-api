import database from '../configs/MongoConfig'

const { mongo } = database

const MessageSchema = new mongo.Schema({
    remoteJid:{
        type: String,
        required: true,
    },
    fromMe:{
        type: Boolean,
    },
    idMessage: {
        type: String,
    },
    username:{
        type: String,
    },
    MessageText:{
        type: String,
    },
    profilePicture:{
        type: String,
    },
    messageTimestamp:{
        type: Number
    },
    isMessageFromStatus:{
        isFromStatus: {
            type: Boolean
        },
        text:{
            type: String
        },
        thumbnail:{
            type: Array
        },
    },
    isMessageFromResponse:{
        isFromResponse: {
            type: Boolean
        },
        text:{
            type: String
        },
    },
    isMessageFromImage:{
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
})

const Message = mongo.model('Message', MessageSchema);

export default Message