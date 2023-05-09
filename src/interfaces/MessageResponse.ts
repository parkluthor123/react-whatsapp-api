import { MessageUpsertType, proto } from "@adiwajshing/baileys";

interface MessageResponse {
    messages: proto.IWebMessageInfo[];
    type: MessageUpsertType;
}
export default MessageResponse;