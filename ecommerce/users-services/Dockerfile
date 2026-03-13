FROM node:20-alpine

LABEL maintainer="studentB"
LABEL version="1.0"

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package.json .

RUN npm install

COPY . .

USER appuser

EXPOSE 5001

CMD ["npm", "start"]