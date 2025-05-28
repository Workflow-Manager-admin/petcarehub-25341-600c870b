#!/bin/bash
cd /home/kavia/workspace/code-generation/petcarehub-25341-600c870b/petcarehub_ui
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

