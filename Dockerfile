FROM node:16
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install --omit=dev
COPY . .
EXPOSE 8080
RUN npx prisma generate
RUN npm run build
CMD [ "node" ] ["dist/main.js"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]
