#!/bin/bash
cd /home/kavia/workspace/code-generation/express-delivery-management-system-314154-314165/delivery_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

