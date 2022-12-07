#!/bin/bash

set -e

if [[ "$ENV" == "development" ]]; then
    yarn
    API_URL='http://127.0.0.1:8000/v1' yarn build
else
    #yarn build:prod
    yarn serve
fi
