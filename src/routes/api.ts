import express from 'express';
import { Request, Response } from 'express';
import Message from '../models/Message';

const router = express.Router();
router.get('/messages', async (req: Request, res: Response) => {
    const messages = await Message.find();
    return res.json(messages);
})

router.post('/messages/update-name', async (req: Request, res: Response) => {
    try {
        const username = req.body.username;
        const remoteJid = req.body.remoteJid;

        const messages = await Message.updateOne({ remoteJid }, { $set: { username } })

        if(messages.acknowledged){
            const messages = await Message.find();
            return res.json(messages);
        }
    } catch (e: any) {
        return res.status(500).json({ error: e.message })
    }
})

export default router;