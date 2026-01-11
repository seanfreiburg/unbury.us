# Production image - uses pre-built frontend
FROM node:20-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev --no-audit && npm cache clean --force

# Copy app files
COPY public ./public
COPY views ./views
COPY routes ./routes
COPY app.js ./

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start the app
CMD ["node", "app.js"]
