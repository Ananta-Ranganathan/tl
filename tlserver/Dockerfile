# Use the official Python 3.11 image as a base image
FROM python:3.11.6

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the requirements.txt file into the container at /usr/src/app
COPY requirements.txt ./

# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of application source code from host to image filesystem.
COPY app.py translate.py startup.sh cleanup.sh requirements.txt ./

# Application listens on port 8000, EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 8000

# Define the command to run application using the startup script
CMD ["bash", "./startup.sh"]
