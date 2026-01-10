import {describe, expect, it, vi} from 'vitest'
import {ResourceType, S3Resource} from "../src/aws_s3";
import * as env from "../environment/environment";
const path = require("path");
const fs = require('fs');

let client = new S3Resource(ResourceType.MLReviewPicture);
describe('aws s3: test ML review picture permissions', () => {
    client = new S3Resource(ResourceType.MLReviewPicture);
    blanketTest();
});
describe('aws s3: test PublicResource permissions', () => {
    console.info('Testing test bucket.');
    client = new S3Resource(ResourceType.PublicResource);
    blanketTest();
    // test prod
    console.info('Testing prod bucket.')
    const envSpy = vi.spyOn(env, 'isDev');
    envSpy.mockResolvedValueOnce(false);
    client = new S3Resource(ResourceType.PublicResource);
    blanketTest();
});
describe('aws s3: test ML review picture permissions', () => {
    client = new S3Resource(ResourceType.ProfilePicture);
    blanketTest();
});
describe('aws s3: test ML review picture permissions', () => {
    client = new S3Resource(ResourceType.MLReviewPicture);
    blanketTest();
});

const blanketTest = () => describe('AWS S3 calls can have CRUD operations' +
    ' done on the' +
    ' bucket', () => {
    it('Should put a file into the ML learning bucket', async () => {
        console.info("Calling readFileSync")
        const f = fs.readFileSync(
            path.resolve(__dirname, './artifacts/favicon.png')
        );
        console.info("File is read!");
        const response = await client.putByteObj('test', f, "image/png")
        console.info("VersionID for obj: ", response);
        expect(response).toBeDefined();
    });

    it('Should get a file by its key', async () => {
        const response = await client.getByteObj('test');
        expect(response.data).toBeDefined();
        expect(response.versionId).toBeDefined();
    });

    it('Should delete a file and all its versions', async () => {
        const response = await client.deleteObject('test');
        console.info("Deleted file: ", response);
        expect(response).toBeDefined();
    });
});
