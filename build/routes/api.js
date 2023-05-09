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
const express_1 = __importDefault(require("express"));
const Message_1 = __importDefault(require("../models/Message"));
const router = express_1.default.Router();
router.get('/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield Message_1.default.find();
    return res.json(messages);
}));
router.post('/messages/update-name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const remoteJid = req.body.remoteJid;
        const messages = yield Message_1.default.updateOne({ remoteJid }, { $set: { username } });
        if (messages.acknowledged) {
            const messages = yield Message_1.default.find();
            return res.json(messages);
        }
    }
    catch (e) {
        return res.status(500).json({ error: e.message });
    }
}));
exports.default = router;
