FROM node:10-alpine
COPY . /
RUN npm install
CMD [ "node", "index.es6" ]
