# docker run --rm ab-test -k -c 1 -n 1 http://172.17.0.1:3000/hello/

# test
# docker run --rm ab-test -k -c 100 -n 100000 http://10.1.0.53:3001/hello/
# stat:
docker run --rm ab-test -k -c 30 -n 10000 http://10.1.0.53:3000/