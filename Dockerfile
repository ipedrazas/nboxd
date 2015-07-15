FROM nginx
MAINTAINER ipedrazas@gmail.com

COPY dist /usr/share/nginx/html

RUN chmod -R 755 /usr/share/nginx/html
