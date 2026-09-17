FROM node:20

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get -y upgrade
RUN apt-get install python3
RUN python3 --version
RUN apt-get -y install python3-rpi.gpio

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build
CMD npm run start

# CMD npm run dev
