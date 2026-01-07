FROM ubuntu
COPY --from=denoland/deno:bin-2.5.6 /deno /usr/local/bin/deno
WORKDIR /app
COPY src/mysite mysite

EXPOSE 8000

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-sys", "mysite/main.ts"]