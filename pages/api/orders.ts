// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { CommunicationProtocolEnum, DaprClient, LogLevel } from '@dapr/dapr';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios"

import { config } from '../../src/common/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    console.log("received orders request "+req.method + " "+req.url)

    // const client = new DaprClient(config.DAPR_HOST, config.DAPR_HTTP_PORT, CommunicationProtocolEnum.HTTP, {
    //     daprApiToken: config.DAPR_API_TOKEN,
    //     logger: {
    //         level: LogLevel.Debug,
    //     },
    // });

    if (req.method === 'POST') {

        console.log("publishing new order");

        let order = req.body;

        // let result = await client.pubsub.publish(config.PUBSUB_NAME, config.PUBSUB_TOPIC, order)

        const publishURL = `${config.DAPR_HOST}:${config.DAPR_HTTP_PORT}/v1.0/publish/${config.PUBSUB_NAME}/${config.PUBSUB_TOPIC}`
        const publishResponse = await axios.post(`${publishURL}`, order, {
            headers: {
                "host": config.DAPR_HOST_DOMAIN,
                "dapr-api-token": config.DAPR_API_TOKEN,
            },
        })
        let result = publishResponse.data;
    
        if (result) {
            res.status(200).json({ result })
        } else {
            res.status(400).json({ error: "error publishing order" })
        }
    } else if (req.method === 'GET') {

        console.log("reading last order processed");

        // let result = await client.state.get(config.ORDERS, "last")
        // console.log("got result "+result)
        // res.status(200).json({ result })

        const stateStoreBaseUrl = `${config.DAPR_HOST}:${config.DAPR_HTTP_PORT}/v1.0/state/${config.ORDERS}`
        const orderResponse = await axios.get(`${stateStoreBaseUrl}/last`, {
            headers: {
                "host": config.DAPR_HOST_DOMAIN,
                "dapr-api-token": config.DAPR_API_TOKEN,
            },
        })
        let result = orderResponse.data;

        console.log("got result "+result)
        res.status(200).json({ result })

    } else {
        res.status(401).json({ error: "bad request" })
    }
}
