FROM ubuntu:18.04

ARG repository="deb http://repo.yandex.ru/clickhouse/deb/stable/ main/"
ARG version=18.10.3

RUN apt-get update && \
    apt-get install -y apt-transport-https dirmngr && \
    mkdir -p /etc/apt/sources.list.d && \
    apt-key adv --keyserver keyserver.ubuntu.com --recv E0C56BD4 && \
    echo $repository | tee /etc/apt/sources.list.d/clickhouse.list && \
    apt-get update && \
    env DEBIAN_FRONTEND=noninteractive apt-get install --allow-unauthenticated -y clickhouse-server=$version clickhouse-client=$version clickhouse-common-static=$version libgcc-7-dev && \
    rm -rf /var/lib/apt/lists/* /var/cache/debconf && \
    apt-get clean

COPY docker_related_config.xml /etc/clickhouse-server/config.d/
RUN chown -R clickhouse /etc/clickhouse-server/

USER clickhouse
EXPOSE 9000 8123 9009

ENV CLICKHOUSE_CONFIG /etc/clickhouse-server/config.xml

ADD init.sql .
RUN /usr/bin/clickhouse-server --config=${CLICKHOUSE_CONFIG} --daemon && sleep 20 && \
    clickhouse-client -h 127.1 --user default -m -n < init.sql

ENTRYPOINT exec /usr/bin/clickhouse-server --config=${CLICKHOUSE_CONFIG}