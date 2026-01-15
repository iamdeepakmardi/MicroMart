FROM node:alpine

WORKDIR /app
COPY package.json .
COPY tsconfig.json .
COPY packages/common packages/common
COPY services/auth services/auth

RUN npm install -w services/auth --omit=dev

WORKDIR /app/services/auth
CMD ["npm", "start"]
