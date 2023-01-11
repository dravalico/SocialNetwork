FROM mongo
COPY user-init.json /user-init.json
COPY message-init.json /message-init.json
CMD mongoimport --host mongo --collection user --type json --file /user-init.json --jsonArray ; mongoimport --host mongo --collection message --type json --file /message-init.json --jsonArray