#! /bin/bash

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Version is required"
    exit 1
fi

#docker build
docker buildx build --platform linux/amd64 -t nj-app .

if [ $? -ne 0 ]; then
    echo "Docker build failed"
    exit 1
fi

#docker tag
docker tag nj-app lephew/nj-app:$VERSION
docker push lephew/nj-app:$VERSION