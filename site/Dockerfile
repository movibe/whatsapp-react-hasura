FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . /app

EXPOSE 3000
# serve build folder on port 8080
CMD npm start
