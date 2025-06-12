FROM alpine:3.21.3


RUN apk add --update --no-cache nodejs npm socat chromium-chromedriver su-exec

WORKDIR /chall
COPY . .
RUN npm install

RUN	npm install && \
	chmod +x /chall/entrypoint.sh

CMD ["/bin/sh", "/chall/entrypoint.sh"]