
import { getServerConfigs } from './environments';
import * as Seneca from "seneca";
import * as Hapi from 'hapi';
import { HapiServer } from './sever-types';
import { Modlues } from './modules/index';
const HOST = process.env.HOST;
const BASES = process.env.BASES;
// const BROADCAST = process.env.BROADCAST
const REGISTRY = process.env.REGISTRY

export class StartServer {
    public server: HapiServer = new Hapi.Server() as HapiServer;

    constructor() {
        const port = getServerConfigs().port;

        this.server.connection({
            port: port,
            routes: {
                cors: true
            }
        });
    }

    public connectServer(env: boolean): void {

        return this.server.register(Modlues, {
            routes: {
                prefix: '/v1'
            }
        },
            (err) => {
                if (err) {
                    throw err
                }

                this.server.initialize((err) => {
                    if (err) {
                        throw err;
                    }

                    // Don't continue to start server if module
                    // is being require()'d (likely in a test)
                    if (!env) {
                        // Starting the server
                        this.server.seneca
                            .use('mesh', {
                                // auto: true,
                                host: HOST,
                                bases: [`${BASES}:39999`],
                                // listen: [
                                //     {
                                //         pins: ['role:ping,cmd:date'],
                                //         host: HOST
                                //     }
                                // ]
                            })
                            .client({
                                type: 'http',
                                host: HOST
                            })
                            .ready(() => {

                                this.server.start(() => {
                                    let serverUri = this.server.info.uri;

                                    console.log(`Server running at:, ${serverUri}`);
                                });

                            })
                    }
                });

            });

    }

}