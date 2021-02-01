#!/bin/bash

cd /var/www/stratum/greenmesa
pm2 stop stratum\
&& git pull \
&& echo "Building App" \
&& npx tsc \
&& echo "Deploying to PM2" \
&& pm2 reload stratum