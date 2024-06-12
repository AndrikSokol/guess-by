FROM node:20-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install
ADD . .
RUN npm run build
RUN npm run migration:run:prod
RUN npm prune --production
CMD ["node", "./dist/main.js"]