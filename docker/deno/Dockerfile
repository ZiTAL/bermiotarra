FROM docker.io/denoland/deno:alpine-2.7.9

WORKDIR /app/web/private

# RUN cd /app/web/private && deno run --allow-run --allow-read --allow-write --allow-net --allow-env build.ts

CMD ["deno", "run", "--allow-all", "server.ts"]
