#!/bin/bash
#docker exec -i guuzen-symfony-webpack-nodejs node $@

#echo ${@:1:$#}
#echo $#
#echo $@
#read arg1 arg2 arg3 arg4

#echo ${arg1}
#echo ${arg2}

#echo $1 $2
nodeCoreModulesLoader="node-core-modules-loader.js"

if [[ $@ == *${nodeCoreModulesLoader}* ]]; then
    params="$1 /var/www/html/docker/nodejs/node-core-modules-loader.js ${@:3:$# - 2}"
else
    params=$@
fi

#echo ${params}
docker exec -i guuzen-symfony-webpack-nodejs node ${params}
#docker exec -i guuzen-symfony-webpack-nodejs node
#/home/artem/projects/guuzen/symfony-webpack/docker/nodejs/node --inspect=42121 /home/artem/soft/PhpStorm-183.4886.46/plugins/JavaScriptLanguage/helpers/node-core-modules/node-core-modules-loader.js assert async_hooks buffer child_process cluster crypto dgram dns domain events fs http https net os path punycode querystring readline repl stream string_decoder tls tty url util v8 vm worker_threads zlib
