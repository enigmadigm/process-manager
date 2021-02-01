#!/bin/bash

cd /var/www/stratm/greenmesa
pm2 stop \
&& git pull \
&& echo "Building App" \
&& npx tsc \
&& echo "Deploying to PM2" \
&& pm2 reload stratum