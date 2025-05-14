# Define build arguments with default values
ARG NODE_VERSION=22.0.0

# Use the official Node.js base image with the specified version and type
FROM node:${NODE_VERSION}

ARG MAINTAINER="Habibur Rahman Riad <riad@gmail.com>"
ARG UID=1000
ARG GID=1000

# Define build-time argument for additional APT dependencies and source directory
ARG APT_DEPENDENCIES="curl telnet"
ARG SOURCE_DIRECTORY="./codes"

# Set metadata for the Docker image maintainer
LABEL maintainer=${MAINTAINER}

# Update and upgrade APT packages
RUN apt-get update && \
    apt-get upgrade -y

# Install additional APT dependencies if specified
RUN if [ -n "${APT_DEPENDENCIES}" ]; then \
        apt-get install -y ${APT_DEPENDENCIES} && \
        apt-get autoremove -y && \
        apt-get clean; \
    fi

# Clean up temporary files to reduce image size
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

USER root
# Check if the `node` user exists and remove it if present
RUN id -u node > /dev/null 2>&1 && userdel -r node || true

# Create the new group and user
RUN groupadd --gid ${GID} app && \
    useradd --uid ${UID} --create-home --system --comment "App User" --shell /bin/bash --gid app app

# Set the working directory inside the container
WORKDIR /usr/src

# Create directory and set permissions before switching user
RUN mkdir -p /usr/src/node_modules && \
    chown -R app:app /usr/src && \
    chmod -R 755 /usr/src

USER app

# Copy source directory and package.json to the container, changing ownership to `app`
COPY --chown=app:app $SOURCE_DIRECTORY /usr/src
COPY --chown=app:app $SOURCE_DIRECTORY/package*.json /usr/src

# Install Node.js dependencies, verify installation, and clean npm cache
RUN npm install && \
    npm list --depth=0 && \
    npm cache verify

# Build the application
# RUN npm run build

# Fix permissions for the .next directory and node_modules
USER root
RUN chown -R app:app /usr/src/.next && \
    chmod -R 755 /usr/src/.next && \
    chown -R app:app /usr/src/node_modules && \
    chmod -R 755 /usr/src/node_modules

USER app
# Expose port 3000 for the application
EXPOSE 3000

# Define the default command to start the application in production mode
CMD ["npm", "run", "dev"]
