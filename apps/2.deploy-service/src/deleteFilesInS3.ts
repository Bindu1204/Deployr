import { S3 } from "aws-sdk";

const R2_ENDPOINT="https://d742946faacb17bc54e8996509568e49.r2.cloudflarestorage.com"
const R2_ACCESS_KEY_ID="0e608e1af543c2a9167a1a6c18c9d430"
const R2_SECRET_ACCESS_KEY="2e27b678bb3d5de670057efe37e84896d0351f86b7fc11751d4f76582af07d8f"

const s3 = new S3({
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    endpoint: R2_ENDPOINT
});

/**
 * Recursively deletes all files and folder markers under a given prefix in R2.
 * @param folderPrefix - The folder path/prefix (e.g., "my-folder/")
 */
export async function deleteAllFilesFromR2(folderPrefix: string): Promise<void> {
    const prefix = folderPrefix.endsWith("/") ? folderPrefix : `${folderPrefix}/`;
    let isTruncated = true;
    let continuationToken: string | undefined;
    let totalDeleted = 0;

    while (isTruncated) {
        const listParams: S3.ListObjectsV2Request = {
            Bucket: "deployr-bucket",
            Prefix: prefix,
            ContinuationToken: continuationToken,
        };

        const listedObjects = await s3.listObjectsV2(listParams).promise();

        const objectsToDelete = listedObjects.Contents?.map(obj => ({ Key: obj.Key! })) || [];

        if (objectsToDelete.length > 0) {
            const deleteParams: S3.DeleteObjectsRequest = {
                Bucket: "deployr-bucket",
                Delete: {
                    Objects: objectsToDelete,
                    Quiet: true,
                }
            };

            const deleteResponse = await s3.deleteObjects(deleteParams).promise();
            totalDeleted += deleteResponse.Deleted?.length || 0;
        }

        isTruncated = !!listedObjects.IsTruncated;
        continuationToken = listedObjects.NextContinuationToken;
    }

    console.log(`✅ Deleted ${totalDeleted} objects from prefix: ${prefix}`);
}