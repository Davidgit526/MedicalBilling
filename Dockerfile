FROM node:latest
 
# Set the working directory
WORKDIR /MedicalBilling
 
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
 
# Install the dependencies
RUN npm install
 
# Copy the rest of the application files to the working directory
COPY . .
 
# Expose the port that the application will run on
EXPOSE 3007
 
# Start the application
CMD [ "node", "MedicalBilling.js" ]