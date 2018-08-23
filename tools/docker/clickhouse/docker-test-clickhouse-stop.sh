#!/usr/bin/env bash
echo "\t--> stoping clickhouse container...";
docker kill "clickhouse-test";
echo "\t--> removing clickhouse container...";
docker rm "clickhouse-test";
echo "\t--> done!";
