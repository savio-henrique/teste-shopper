FROM node:18

WORKDIR /usr/src/app

# Install app dependencies
COPY ./package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
# RUN npm install next@13.4.19
COPY . .

EXPOSE 3333

CMD [ "npm" , "run" , "dev" ]

# if for production
# CMD [ "npm" , "run" , "build" ]

# CMD [ "npm" , "run", "start" ]