#!/bin/bash
set -e

if [ -n "$TF_PORT_9000_TCP_ADDR" ] && [ -n "$TF_PORT_9000_TCP_PORT" ]; then
  export TENSORFLOW_SERVING_CONNECTION="${TF_PORT_9000_TCP_ADDR}:${TF_PORT_9000_TCP_PORT}"
fi
echo "TENSORFLOW SERVING: ${TENSORFLOW_SERVING_CONNECTION}"

# execute nodejs application
exec npm start
