rm -rf ./build &&
mkdir -p ./build  &&
mkdir -p ./geo_db &&
flow-remove-types ./src/ -d ./build/ --all --pretty &&
cp -R ./src/config ./build &&
cp -R ./src ./build &&
rm -rf ./build/src