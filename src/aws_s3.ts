import {
    DeleteObjectCommand,
    DeleteObjectRequest,
    GetObjectCommand,
    GetObjectRequest,
    PutObjectCommand,
    PutObjectRequest,
    S3Client
} from "@aws-sdk/client-s3";
import getEnvironment, {isDev} from "../environment/environment";
import {StreamingBlobTypes} from "@smithy/types";
import { ImageMeta, imageMeta } from 'image-meta';
import { NetworkMethods } from './callouts';
import { INetwork, ReloginInfo } from './network';
import {
    ApiMessageResponse,
    NoResultsResponse, S3Session,
    ServerResponse, SessionResponse,
} from '../definitions/responses';

/**
 *
 *             "users" => Self::users,
 *             "teams" => Self::teams,
 *             "social_feed" => Self::social_feed,
 */
export enum S3ResourceType {
    users = "users",
    teams = "teams",
    socialFeed = "social_feed",
    facilitySatelliteReviews = "facility_satellite_reviews",
    RemoteResources = "fail", // Not yet implemented.
}

export class S3Resource {
    private static relogin_ : ReloginInfo | undefined;
    private static token_ : string;
    private static network_ : INetwork;

    public set token(token: string) {
        S3Resource.token_ = token;
    }

    public set relogin(relogin : ReloginInfo | undefined) {
        S3Resource.relogin_ = relogin;
    }

    public set network(network: INetwork) {
        S3Resource.network_ = network;
    }
    public get has_client(): boolean {
        return !!this.client;
    }

    private type : S3ResourceType;
    private region_ = 'us-east-1';
    private s3Bucket: string;
    private folderPrefix: string = '';
    private supportsACL = false;
    private client: S3Client;

    public set toRegion(region: string) {
        this.region_ = region;
    }

    public get bucket(): string {
        return this.s3Bucket;
    }
    public get region(): string {
        return this.region_;
    }
    public get folderPrfx() : string {
        return this.folderPrefix;
    }

    private addReactNativeChecksumFix() {
        this.client.middlewareStack.add(
            (next) => async (args) => {
                const result = await next(args);
                if (result?.response?.headers) {
                    const headers = result.response.headers;
                    for (const key of Object.keys(headers)) {
                        if (key.toLowerCase().startsWith('x-amz-checksum-')) {
                            delete headers[key];
                        }
                    }
                }
                return result;
            },
            {
                step: 'deserialize',
                priority: 'low',
                name: 'stripChecksumHeaders',
            }
        );
    }

    public createS3ClientWithSessionIdCredentials() : Promise<void> {
        let promise = NetworkMethods.promisifyGetS3ClientSessionId(S3Resource.relogin_, S3Resource.network_, S3Resource.token_, this.type).then(r => {
            if (r.isSuccessful) {
                let session = r.resp as S3Session;
                try {
                    this.client = new S3Client({
                        region: this.region_,
                        credentials: {
                            accessKeyId: session.access_key_id,
                            secretAccessKey: session.secret_access_key,
                            sessionToken: session.session_token
                        },
                        responseChecksumValidation: 'WHEN_REQUIRED',
                        requestChecksumCalculation: 'WHEN_REQUIRED'
                    });
                    this.addReactNativeChecksumFix();
                } catch (e) {
                    console.error(e);
                    throw new Error(e.message);
                }
            } else {
                throw new Error(ApiMessageResponse.fromServerResponse(r).message);
            }
        }).catch(err => {
            console.error(err);
            throw new Error(err.message);
        });
        return promise;
    }
    /**
     * If network/token are undefined, set the network or token manually after
     * creating
     * S3Resource instance.
     * Once an instance has set it, not necessary to set it again.
     * @param resourceType
     * @param network
     * @param token
     */
    constructor(public readonly resourceType: S3ResourceType, network?: INetwork, token?: string, relogin?: ReloginInfo) {
        this.type = resourceType;
				if (network) {
            S3Resource.network_ = network;
        }
        if (token) {
            S3Resource.token_ = token;
        }
        if (relogin) {
            S3Resource.relogin_ = relogin;
        }
				const { credentials } = getEnvironment();
        switch (resourceType) {
            case S3ResourceType.users: {
                this.s3Bucket =  isDev() ? 'puf-test-public-resources' : 'puf-prod-public-resources';
                this.folderPrefix = 'user/';
                break;
            }
            case S3ResourceType.teams: {
                this.s3Bucket =  isDev() ? 'puf-test-public-resources' : 'puf-prod-public-resources';
                this.folderPrefix = 'team/';
                break;
            }
            case S3ResourceType.socialFeed: {
                this.s3Bucket =  isDev() ? 'puf-test-public-resources' : 'puf-prod-public-resources';
                this.folderPrefix = 'social/';
                break;
            }
            case S3ResourceType.facilitySatelliteReviews: {
                this.s3Bucket = 'puf-mobile-satellite-imgs';
                this.folderPrefix = '';
                break;
            }
        }
        if (credentials.secretAccessKey && credentials.accessKeyId) {
            this.client = new S3Client({
                region: this.region_,
                credentials: credentials,
                responseChecksumValidation: 'WHEN_REQUIRED',
                requestChecksumCalculation: 'WHEN_REQUIRED'
            })
            this.addReactNativeChecksumFix();
        } else if (S3Resource.network_ && S3Resource.token_) {
            console.log("Setting s3client with sessionid...");
            this.createS3ClientWithSessionIdCredentials();
        }
    }


	/**
	 * Detects whether file is a valid image.
	 * Uploads it to appropriate bucket using gateway/api as auth.
	 * @param relogin
	 * @param key
	 * @param readableS
	 * @param contentTypeMime
	 * @param type_
	 */
		public async putByteImageObjViaGateway(relogin: ReloginInfo, key: number, bytes: Uint8Array<ArrayBuffer>, fd : FormData): Promise<ServerResponse<NoResultsResponse>> {
			try {
				const im : ImageMeta = imageMeta(bytes);
				console.debug('imageMeta determined', im);
				return NetworkMethods.promisifyPutS3ImageObj(relogin, this.token, this.resourceType, key, bytes, 'image/' + im.type);
			} catch(error) {
				console.error(error);
				return Promise.reject(error);
			}
		}
    /**
     * Puts an object to an S3 bucket.
     * DEPRECATED for public
     * @param key The key to use for the object in the S3 bucket.
     * @param contentTypeMime The content type of the object.
     * @param isPublicRead If true, the object will be publicly readable.
     * @param grantFullControl If true, the bucket owner will have full control over the object.
     * @returns A promise that resolves to the version ID of the uploaded object.
     */
    private putByteObj(key: string, readableS: StreamingBlobTypes, contentTypeMime: string, isPublicRead = true, grantFullControl?: boolean): Promise<string> {
        let acl;
        /**
         * Set the ACL of the object based on the parameters.
         * If isPublicRead is true and grantFullControl is true, the ACL will be set to
         * 'bucket-owner-full-control'. If isPublicRead is true, the ACL will be set to
         * 'public-read'. If grantFullControl is true, the ACL will be set to
         * 'bucket-owner-read'. Otherwise, the ACL will be set to 'private', which means
         * that only the user who uploaded the object has read/write access.
         */
        if (this.supportsACL) {
            if (isPublicRead && grantFullControl) {
                acl = 'bucket-owner-full-control';
            } else if (isPublicRead) {
                acl = 'public-read'
            } else if (grantFullControl) {
                acl = 'bucket-owner-read'
            } else {
                acl = 'private'; // only the user who uploaded the object has
            }
        }
        const cmd: PutObjectRequest = {
            Bucket: this.s3Bucket,
            ContentType: contentTypeMime,
            ACL: acl,
            Key: this.folderPrefix + key,
            Body: readableS
        }
        return this.client.send(new PutObjectCommand(cmd)).then(response => {
            console.info(`Put s3 bucket obj with content type: ${contentTypeMime}, version: ${response.VersionId}.`);
            return response.VersionId;
        });
    }

    /**
     * Retrieves an object from an S3 bucket as a byte array.
     *
     * @param key The key of the object to retrieve from the S3 bucket.
     * @returns A promise that resolves to the byte array of the retrieved object.
     */
    public getByteObj(key: string): Promise<{
        data: Promise<Uint8Array>,
        versionId: string
    }> {
        const cmd: GetObjectRequest = {
            Bucket: this.s3Bucket,
            Key: this.folderPrefix + key
        };
        // Send the command to S3 to retrieve the object
        return this.client.send(new GetObjectCommand(cmd)).then(response => {
            console.info(`Received s3 bucket obj with content type: ${response.ContentType}`);
            // Transform the response body to a byte array
            return {
                data: response.Body.transformToByteArray(),
                versionId: response.VersionId
            };
        });
    }

    /**
     * Deletes an object from an S3 bucket.
     *
     * @param key The key of the object to delete from the S3 bucket.
     * @param versionId The version ID of the object to delete. If not provided, the latest version of the object will be deleted.
     * @returns A promise that resolves to the version ID of the deleted object.
     */
    public deleteObject(key: string, versionId?: string): Promise<string> {
        const cmd: DeleteObjectRequest = {
            /**
             * The name of the S3 bucket to delete the object from.
             */
            Bucket: this.s3Bucket,
            /**
             * The key of the object to delete from the S3 bucket.
             */
            Key: this.folderPrefix + key,
            /**
             * The version ID of the object to delete. If not provided, the latest version of the object will be deleted.
             */
            VersionId: versionId
        };
        return this.client.send(new DeleteObjectCommand(cmd)).then(response => {
            console.info(`Deleted s3 bucket obj with key: ${key}, version: ${response.VersionId}`)
            return response.VersionId;
        });
    }


}