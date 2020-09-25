FROM node as builder
WORKDIR /work
RUN mkdir -p /work
COPY package.json package-lock.json /work/
RUN npm install
COPY . /work
RUN npm run build

FROM node:alpine
RUN mkdir -p /app
WORKDIR /app
COPY --from=builder /work/package.json /work/package-lock.json /app/
RUN npm install --only=prod
COPY --from=builder /work/public/build/bundle.js /work/public/build/bundle.css /work/src/server.js /app/
RUN sed 's:/public/build/::' -i server.js
ENV MIDP_BASE_DIR='.' LISTEN_ADDR='0.0.0.0'
CMD ["node", "server.js"]
