# Stage 1: Build blog from markdown
FROM python:3.12-alpine AS builder

WORKDIR /app
COPY . .

RUN pip install --no-cache-dir markdown && \
    python build.py

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy all site files (including Python-generated blog HTML)
COPY --from=builder /app /usr/share/nginx/html

# Remove build artifacts that shouldn't be served
RUN rm -f /usr/share/nginx/html/build.py \
          /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/requirements.txt && \
    rm -rf /usr/share/nginx/html/.git \
           /usr/share/nginx/html/blog/posts

# Expose port 80 to allow external access
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
