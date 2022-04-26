## Stage one: where the app is built
FROM node:14.17 AS builder
WORKDIR /usr

# We copy the necessary files to build our project
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY tsconfig-build.json ./
COPY src ./src

# We build our project
RUN ls -a
RUN yarn install
RUN yarn build-ts

## Stage two: where the app actually runs
FROM node:14.17 AS runner
WORKDIR /usr
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY prod-paths.js ./
RUN yarn install --production

# Here we copy all of our dist folder to the docker image
COPY --from=builder /usr/dist ./dist

# # PM2 will handle the actual server
# RUN npm install pm2 -g
# EXPOSE 8000
# # PM2 will handle the actual server
# CMD ["pm2-runtime","src/index.js"]

CMD ["yarn", "start"]