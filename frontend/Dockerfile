#FROM ubuntu
#COPY --from=denoland/deno:bin-2.5.6 /deno /usr/local/bin/deno

FROM nginx:1.28.0

RUN rm -rf /usr/share/nginx/html
COPY static /usr/share/nginx/html