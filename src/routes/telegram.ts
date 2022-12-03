import { Routes } from '@/interfaces/routes.interface';
import { Request, Response, Router } from 'express';
import { Browser } from 'puppeteer';
import { Client } from 'tdl';

class TelegramRoutes implements Routes {
    public path = '/';
    public router = Router();
    public client: Client;

    constructor(client: Client) {
        this.initializeRoutes();
        this.client = client;
    }

    private initializeRoutes() {
        this.router.post(`${this.path}startJob`, async (req: Request, res: Response) => {
            await this.client.invoke({
                _: 'sendMessage',
                chat_id: 5411670189,
                input_message_content: {
                    _: 'inputMessageText',
                    text: {
                        _: 'formattedText',
                        text: '🎲 Nhận nhiệm vụ',
                    },
                },
            });
            return res.json({ message: '🎲 Nhận nhiệm vụ' });
        });

        this.router.post(`${this.path}finishJob`, async (req: Request, res: Response) => {
            await this.client.invoke({
                _: 'sendMessage',
                chat_id: 5411670189,
                input_message_content: {
                    _: 'inputMessageText',
                    text: {
                        _: 'formattedText',
                        text: '☑️ Hoàn thành',
                    },
                },
            });
            return res.json({ message: '☑️ Hoàn thành' });
        });

        this.router.post(`${this.path}getChat`, async (req: Request, res: Response) => {
            const data = await this.client.invoke({
                _: 'getChats',
                chat_list: { _: 'chatListMain' },
                limit: 4000,
            });
            return res.json(data);
        });

        this.router.post(`${this.path}leaveChat`, async (req: Request, res: Response) => {
            const data = await this.client.invoke({
                _: 'leaveChat',
                chat_id: -1001808180038,
            });
            return res.json(data);
        });

        this.router.post(`${this.path}getChatHistory`, async (req: Request, res: Response) => {
            const data = await this.client.invoke({
                _: 'getChatHistory',
                chat_id: -1001808180038,
                limit: 100,
                from_message_id: 8388608,
            });
            return res.json(data);
        });
    }
}

export default TelegramRoutes;
