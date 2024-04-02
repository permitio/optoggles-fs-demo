# Build stage
FROM node:16 as BuildStage
WORKDIR /app
# Copy the package.json and package-lock.json
COPY package.json package-lock.json README.md ./
# Install the dependencies
RUN npm install
# Copy the rest of the files
COPY src/* src/
COPY public/* public/
# Build the frontend
RUN npm run build
# Main image
FROM node:16
WORKDIR /app
# Copy the built files
COPY --from=BuildStage /app/build ./build
# Expose the port

EXPOSE 3000
# Run the frontend
CMD ["npx","serve", "-s","build"]