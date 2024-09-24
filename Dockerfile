# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies (including bcrypt) inside the container
RUN npm install -f

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Run the application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Define environment variables
ENV DB_TYPE=mysql \
    DB_USER=sqlserver \
    DB_PASSWORD=H2()n5|P-Y5l>PV= \
    DB_DATABASE=IHXSupreme \
    DB_HOST=db-stg.ihx.in \
    DB_PORT=1433 \
    DB_LOGGING=false \
    DB_SYNCHRONISATION=false \
    DB_MediAuth_DATABASE=MediAuth \
    DB_VALHALLA_DATABASE=Valhalla \
    DB_IHX_PROVIDER_DATABASE=IHXProvider \
    UI_URL=http://localhost:3000

# Copy only the built files from the previous stage
COPY --from=builder /app/dist ./dist
# Copy frontend dist folder (assuming this is where the UI files are located)
COPY --from=builder /app/ui ./ui
# Copy only the required node_modules from the builder
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
# CMD ["npm", "start:stg"]

# Command to run the application
CMD ["node", "dist/main"]
