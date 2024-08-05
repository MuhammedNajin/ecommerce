# use officail node.js image as base image
FROM node:20.15

# set the working directory in the container
WORKDIR /E-COMMERCE

# Copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

ENV name nd
# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the app
CMD ["npm", "start"]
