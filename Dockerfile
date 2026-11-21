FROM node:20-alpine
WORKDIR /app
COPY server.js .
RUN npm i pg@8
CMD ["node", "server.js"]
