#!/bin/bash

cd /var/www/cilivia/ninjartzip
pm2 stop ninj \
&& git pull \
&& echo "Building App" \
&& npx tsc \
&& echo "Deploying to PM2" \
&& pm2 reload ninj