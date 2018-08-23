FROM node:8-alpine as builder
COPY . /tmp/app
WORKDIR /tmp/app
RUN npm install
RUN npm test
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /tmp/app/dist /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
