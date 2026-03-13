FROM node:18-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package.json .

RUN npm install

COPY . .

USER appuser

EXPOSE 5001

CMD ["npm", "start"]