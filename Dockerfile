
FROM node:latest

WORKDIR /app
COPY src/ .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]
