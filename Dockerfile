FROM node:8-alpine as builder

COPY . /cmod

WORKDIR /cmod

RUN npm install && npm test && npm run build


FROM nginx:stable-alpine

COPY --from=builder /cmod/dist /usr/share/nginx/html

COPY ./config/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
