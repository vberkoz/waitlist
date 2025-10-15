#!/bin/bash

BUCKET="waitliststoragestack-assetsbucket5cb76180-0s2hoqqvpg1j"

echo "=== S3 Bucket Configuration ==="
echo "Bucket Name: $BUCKET"
echo ""

echo "=== Encryption ==="
aws s3api get-bucket-encryption --bucket $BUCKET --profile basil --output json | jq .

echo -e "\n=== Lifecycle Rules ==="
aws s3api get-bucket-lifecycle-configuration --bucket $BUCKET --profile basil --output json | jq .

echo -e "\n=== CORS Configuration ==="
aws s3api get-bucket-cors --bucket $BUCKET --profile basil --output json | jq .

echo -e "\n=== Public Access Block ==="
aws s3api get-public-access-block --bucket $BUCKET --profile basil --output json | jq .

echo -e "\n=== Test Upload ==="
echo "test content" > /tmp/test-file.txt
aws s3 cp /tmp/test-file.txt s3://$BUCKET/test/test-file.txt --profile basil && echo "✅ Upload successful"

echo -e "\n=== Test Download ==="
aws s3 cp s3://$BUCKET/test/test-file.txt /tmp/test-download.txt --profile basil && echo "✅ Download successful"

echo -e "\n=== Test Export Folder ==="
aws s3 cp /tmp/test-file.txt s3://$BUCKET/exports/test-export.csv --profile basil && echo "✅ Export upload successful"

echo -e "\n=== List Bucket Contents ==="
aws s3 ls s3://$BUCKET/ --recursive --profile basil

echo -e "\n=== Cleanup ==="
aws s3 rm s3://$BUCKET/test/test-file.txt --profile basil
aws s3 rm s3://$BUCKET/exports/test-export.csv --profile basil
rm /tmp/test-file.txt /tmp/test-download.txt
echo "✅ Cleanup complete"
