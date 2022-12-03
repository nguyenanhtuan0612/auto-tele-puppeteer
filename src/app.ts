import express from 'express';
import { NODE_ENV, PORT } from '@config';
import { Client } from 'tdl';
import { TDLib } from 'tdl-tdlib-addon';
import { getTdjson } from 'prebuilt-tdlib';
import { Routes } from './interfaces/routes.interface';
import TelegramRoutes from './routes/telegram';
import _ from 'lodash';
import puppeteer from 'puppeteer-core';

const client = new Client(new TDLib(getTdjson()), {
    apiId: 25552215, // Your api_id
    apiHash: '81c61a28d47e49c2df1fe06a24094a20', // Your api_hash
});

class App {
    public app: express.Application;
    public env: string;
    public port: string | number;

    constructor() {
        this.app = express();
        this.env = NODE_ENV || 'development';
        this.port = PORT || 5001;

        this.initializeRoutes([new TelegramRoutes(client)]);
    }

    public listen() {
        this.app.listen(this.port, async () => {
            console.log(`=================================`);
            console.log(`======= ENV: ${this.env} =======`);
            console.log(`🚀 App listening on the port ${this.port}`);
            console.log(`=================================`);

            const browser = await puppeteer.launch({
                headless: false,
                args: ['--window-size=1920,1080'],
                executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            });

            const pageLogin = await browser.newPage();
            await pageLogin.goto('https://web.telegram.org/k/');
            await pageLogin.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

            await client.login();
            console.log('Logged in');
            //https://t.me/+j2wdw58C_yxkZGRl

            client.on('update', async (update) => {
                switch (update._) {
                    case 'updateNewMessage': {
                        if (update.message.sender_id['user_id'] === 5411670189) {
                            //const prefix = `Message original date ${new Date(update.message.date * 1000)} \nMessage receive date ${new Date()} \n`;
                            const content: any = update.message.content;
                            if (_.result(content, 'text.text')) {
                                const msg = content.text.text;
                                switch (true) {
                                    case msg.includes('Link hướng dẫn: '): {
                                        const link = msg.split('Link hướng dẫn: ')[1].split(' ')[0];
                                        console.log('Get link ' + link);
                                        const page = await browser.newPage();
                                        await page.goto(link);

                                        // const cookies = [
                                        //     {
                                        //         name: 'stel_web_auth',
                                        //         value: 'https://web.telegram.org/k/',
                                        //         domain: 'web.telegram.org',
                                        //         path: '/',
                                        //     },
                                        //     {
                                        //         name: 'stel_web_auth',
                                        //         value: 'https://web.telegram.org/k/',
                                        //         domain: 't.me',
                                        //         path: '/',
                                        //     },
                                        //     {
                                        //         name: 'stel_web_auth',
                                        //         value: 'https://web.telegram.org/k/',
                                        //         domain: 'telegram.me',
                                        //         path: '/',
                                        //     },
                                        // ];
                                        //await page.setCookie(...cookies);
                                        console.log(await page.cookies(link));

                                        // const openWeb = await page.$('tgme_action_button_label');
                                        // await openWeb.click();
                                    }
                                    default: {
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });

            //client.close();
        });
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach((route) => {
            this.app.use('/', route.router);
        });
    }

    public getServer() {
        return this.app;
    }
}

export default App;
