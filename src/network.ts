import { ServerResponse } from "../definitions/responses";
import { User } from "../definitions/schema";
import getEnvironment from "../environment/environment";


export type Action = {
    key?: string;
    type: string;
};

export type ReloginInfo = {
    user : User,
    dispatch: any
}
export class ReloginInfoUtil {
    public static from(un: string, pw: string, dispatch: any ) : ReloginInfo {
        return {
            user: { un: un, pw: pw} as User,
            dispatch: dispatch
        }
    }
}

const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'puf-api-gateway-key': getEnvironment().gateway_api_key,
};
const allHeaders = {
    api: {
        ...defaultHeaders,
        'puf-api-key': getEnvironment().key_puf_api
    },
    notifications: { ...defaultHeaders, 'puf-notifier-auth': 'thisisthepufnotifierkeyvalue' },
    qmq: { ...defaultHeaders, 'puf-qmq-key': getEnvironment().key_puf_qmq },
    billing: {...defaultHeaders, 'puf-billing-auth': getEnvironment().key_puf_billing }
};
export enum Service {
    Api,
    QmQ,
    Billing,
    Notifications,
}
export interface INetwork {
    start(
        reloginInfo: ReloginInfo,
        token: string,
        form_item_or_obj: any,
        body: any,
        https_method: string,
        no_messages?: boolean,
        navigation?: any,
    ): Promise<ServerResponse<any>>;
    onComplete() : void;
}
export abstract class CommonNetwork {
    public static find_https_call_obj(form_item_or_obj: any) : { x: HttpCall | any, is_for_login: boolean} {
        if (form_item_or_obj.meta_body) {
					return {x : form_item_or_obj, is_for_login: form_item_or_obj.is_for_login};
				} else {
					return { x: form_item_or_obj, is_for_login: false};
				}
    }
    public static get_headers(token: string, x: any | HttpCall): any {
        let headers;
        if (x.service) {
            switch (x.service as Service) {
                case Service.Api: {
                    headers = allHeaders.api;
                    break;
                }
                case Service.QmQ: {
                    headers = allHeaders.qmq;
                    break;
                }
                case Service.Billing: {
                    headers = allHeaders.billing;
                    break;
                }
                case Service.Notifications: {
                    headers = allHeaders.notifications;
                    break;
                }
                default: {
                    console.error('should not error on setting headers for this api.');
                }
            }
        } else if (x.meta_headers) {
            headers = { ...defaultHeaders };
            // @ts-ignore
            headers[x.meta_headers.header_key] =
                getEnvironment()[x.meta_headers.env_key_for_auth];
        } else {
            // default to api
            headers = allHeaders.api;
        }
        headers = { ...headers, ...x.headers_override, Authorization: token };
        return headers;
    }
}


export class AuthHeaders {
    env_key_for_auth: string;
    header_key: string;
}
export class HttpCall {
    env_key_for_url = 'uri_puf_mobile_server';
    navigate_to: any = null;
    service = Service.Api;
    success_message = '';
    no_messages = false;
		public is_for_login = false;
    callback: Function;
    meta_headers: AuthHeaders; /*= {
		env_key_for_auth: 'key_puf_api',
		header_key: 'puf-api-key',
	};*/
    meta_body = {
        outside_data: new Array<any>(),
    };
    response_dispatch_additional: any = null;
    response_object_action: any = null;
    failure_dispatch = new Array<any>();
    headers_override = {};
    postfix_uri = '';
    set_failure_dispatch(actions: Array<any>): HttpCall {
        this.failure_dispatch = actions;
        return this;
    }
    add_header(obj: any): HttpCall {
        this.headers_override = { ...this.headers_override, ...obj };
        alert(JSON.stringify(this.headers_override));
        return this;
    }
    set_service(service: Service): HttpCall {
        this.service = service;
        return this;
    }
    set_success_msg(template: string): HttpCall {
        this.success_message = template;
        return this;
    }
		set_is_for_login(val: boolean): HttpCall {
			this.is_for_login = val;
			return this;
		}

    add_outside_data(
        state_key: string,
        reducer_key: string,
        id_key: string,
        map_to_request_key: string,
    ): HttpCall {
        this.meta_body.outside_data.push({
            state_key: state_key,
            reducer_key: reducer_key,
            id_key: id_key,
            map_to_request_key: map_to_request_key,
        });
        return this;
    }
    set_auth_headers(authHeaders: AuthHeaders): HttpCall {
        this.meta_headers = authHeaders;
        return this;
    }
    set_dispatch_response_body_action(
        action: Action,
        callback?: Function,
    ): HttpCall {
        this.response_object_action = action;
        if (callback) {
            this.callback = callback;
        }
        return this;
    }
    set_dispatch_additional_action(action: Action): HttpCall {
        this.response_dispatch_additional = action;
        return this;
    }
    set_postfix_uri(val: string): HttpCall {
        this.postfix_uri = val;
        return this;
    }
    set_no_messages(val: boolean): HttpCall {
        this.no_messages = val;
        return this;
    }
    set_navigate_to(val: string): HttpCall {
        this.navigate_to = val;
        return this;
    }
}