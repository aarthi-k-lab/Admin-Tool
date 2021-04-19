FROM node:8-alpine as builder

COPY . /cmod

WORKDIR /cmod

RUN npm install 
RUN npm test || exit 1
RUN npm run build

FROM nginxinc/nginx-unprivileged


COPY --from=builder /cmod/coverage/junit.xml /usr/share/nginx/html

#RUN mkdir /var/cache/nginx/client_temp

RUN chmod 777 /var/cache/nginx

#RUN chown -R $UID:$GID /var/cache/nginx/client_temp

COPY --from=builder /cmod/dist /usr/share/nginx/html

COPY ./config/nginx.conf /etc/nginx/nginx.conf


