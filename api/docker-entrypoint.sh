#!/bin/bash
set -e

if [ -z "$TENSORFLOW_SERVING_CONNECTION" ]; then
    echo "TENSORFLOW_SERVING_CONNECTION environment variable required"
    exit 1
fi

# execute nodejs application
exec npm start
