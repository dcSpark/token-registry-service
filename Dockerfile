FROM node:14.17.6-alpine3.13

#Install PM2
RUN npm install pm2 -g

# Create app directory
WORKDIR /app

RUN apk add git
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

COPY . .

RUN git submodule update --init

RUN npm install
RUN npm run build

# If you are building your code for production
# RUN npm ci --only=production

#List the Directory Structure

EXPOSE 8091
CMD ["git", "submodule", "update", "--init"]
CMD ["pm2-runtime", "--json", "pm2.yaml"]
