import * as Prod from './environment-prod.json';
import * as Dev from './environment-dev.json';

export type EnvironmentProps = {
    gateway_api_key: string;
    uri_puf_mobile_server: string;
    mapbox_api: string;
    /// Also the Google Geocode API key
    geocodeapikey: string;
    uri_puf_synapse: string;
    key_puf_billing: string;
    key_puf_api: string;
    key_puf_synapse: string;
    key_puf_qmq: string;
    key_puf_notify: string;
    stripe_key: string;
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
        sessionToken? : string;
    }
}
declare var __DEV__;
export default function getEnvironment() : EnvironmentProps {
    console.log(`process.env.isDev is ${JSON.stringify(process.env.NEXT_PUBLIC_isDev)}.`);
    return process.env.NEXT_PUBLIC_isDev === '1' || __DEV__ ? Dev : Prod;
}
export function isDev(): boolean {
    return process.env.NEXT_PUBLIC_isDev === '1';
}