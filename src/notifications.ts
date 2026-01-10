/**
 * Default all values are initialized to rust defaults.  All booleans are init'd to false.
 * All numbers are init'd to 0.
 */
import {NotificationT, Verification} from "../definitions/requests";

export class VerificationRequest implements Verification {
    email_address: string = "";
    is_email_verify: boolean = false;
    is_phone_verify: boolean = false;
    phone_number: string = "";
    supercede_user_preferences: boolean = false;
    table_key: number = 0;
    table_name: string = "";
    timezone_minute_offset: number = 0;
    metadata1: string | null = null;
    constructor(table_name: string, table_key : number) {
        this.table_name = table_name;
        this.table_key = table_key;
    }
    public emailAddress(emailAddress: string) : VerificationRequest {
        this.email_address = emailAddress;
        return this;
    }
    public isEmailVerify(emailVerify: boolean) : VerificationRequest {
        this.is_email_verify = emailVerify;
        return this;
    }
    public isPhoneVerify(phoneVerify: boolean) : VerificationRequest {
        this.is_phone_verify = phoneVerify;
        return this;
    }

    public phoneNumber(phonenumber: string) : VerificationRequest {
        this.phone_number = phonenumber;
        return this;
    }
    public tableKey(key: number) : VerificationRequest {
        this.table_key = key;
        return this;
    }
    public tableName(tableName: string) : VerificationRequest {
        this.table_name = tableName;
        return this;
    }
    public tzMinuteOffset(offset: number) : VerificationRequest {
        this.timezone_minute_offset = offset;
        return this;
    }
    public supercedeUserPref(supercede: boolean) : VerificationRequest {
        this.supercede_user_preferences = supercede;
        return this;
    }

    public setMetadata1(metadata1: string) : VerificationRequest {
        this.metadata1 = metadata1;
        return this;
    }
}

/**
 * This is seen in puf-notifier.  This is different than VerificationRequest, which is found on API.
 */
export class Notification implements NotificationT {
    public emailAddresses: string[] | null = null;
    public eventId: number | null = null;
    public notificationType: string = "";
    public phoneNumbers: string[] | null = null;
    public recipientUserDevices: string[] | null = null;
    public recipientUserIds: number[] | null = null;
    public requesterFirstName: string | null = null;
    public requesterLastName: string | null = null;
    public supercede_user_preferences: boolean | null = null;
    public table_key: number | null = null;
    public table_name: string | null = null;
    public timezone_minute_offset: number | null = null;
    constructor(notificationType : string) {
        this.notificationType = notificationType;
    }

}
