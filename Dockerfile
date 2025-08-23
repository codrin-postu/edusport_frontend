FROM node:24.6-alpine

WORKDIR /app

# Install build dependencies for lightningcss
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]