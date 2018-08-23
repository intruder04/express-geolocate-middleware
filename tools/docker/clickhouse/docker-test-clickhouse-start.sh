#!/usr/bin/env bash
echo "\t--> running clickhouse service";
docker run -d -p 8123:8123 --name "clickhouse-test" clickhouse-test;
sleep 5;