FROM node:18

WORKDIR /usr/src/app

# Install app dependencies
COPY application/backend-shopper/package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY application/backend-shopper .

EXPOSE 3333

CMD [ "npm" , "run" , "dev" ]

# if for production
# CMD [ "npm" , "run" , "build" ]

# CMD [ "node" , "dist/index.js" ]