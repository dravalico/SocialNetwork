FROM mongo
COPY init.json /init.json
CMD mongoimport --host mongo --collection user --type json --file /init.json --jsonArray