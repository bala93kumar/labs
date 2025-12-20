FROM eclipse-temurin:11-jre-focal

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip curl openssh-server openssh-client && \
    rm -rf /var/lib/apt/lists/*

# Install pip packages
RUN pip3 install pyspark numpy pandas

# Download and install Spark
RUN curl -fSL https://archive.apache.org/dist/spark/spark-3.5.0/spark-3.5.0-bin-hadoop3.tgz \
    | tar xz -C /opt/ && \
    mv /opt/spark-3.5.0-bin-hadoop3 /opt/spark

# Set environment variables
ENV SPARK_HOME=/opt/spark
ENV PATH=$SPARK_HOME/bin:$SPARK_HOME/sbin:$PATH
ENV JAVA_HOME=/opt/java/openjdk

# Create SSH directory for passwordless communication
RUN mkdir -p /root/.ssh && \
    chmod 700 /root/.ssh && \
    ssh-keygen -t rsa -f /root/.ssh/id_rsa -N ""

# Configure SSH
RUN cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys && \
    chmod 600 /root/.ssh/authorized_keys && \
    echo "StrictHostKeyChecking no" >> /etc/ssh/ssh_config && \
    echo "UserKnownHostsFile=/dev/null" >> /etc/ssh/ssh_config

# Create app directory
WORKDIR /app

# Copy spark configuration
COPY spark-env.sh $SPARK_HOME/conf/
COPY workers $SPARK_HOME/conf/

# Expose ports
# Master UI: 8080, Spark Submit: 7077, Worker UI: 8081, History Server: 18080
EXPOSE 8080 7077 8081 18080 6066

# Start SSH and Spark
CMD ["/bin/bash", "-c", "service ssh start && /bin/bash"]
