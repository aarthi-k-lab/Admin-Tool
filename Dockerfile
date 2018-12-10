FROM node:8-alpine as builder

COPY . /cmod

WORKDIR /cmod

RUN npm install 
RUN npm test || echo "Unit Tests Failed"
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /cmod/coverage/junit.xml /usr/share/nginx/html

COPY --from=builder /cmod/dist /usr/share/nginx/html

COPY ./config/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
