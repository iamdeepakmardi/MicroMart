FROM node:alpine

WORKDIR /app
COPY package.json .
COPY tsconfig.json .
COPY packages/common packages/common
COPY services/catalog services/catalog

RUN npm install -w services/catalog --omit=dev

WORKDIR /app/services/catalog
CMD ["npm", "start"]
