FROM eclipse-temurin:11-jre-focal

WORKDIR /app

# Install Python and Spark dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip curl && \
    rm -rf /var/lib/apt/lists/*

# Download and install Spark
RUN curl -fSL https://archive.apache.org/dist/spark/spark-3.5.0/spark-3.5.0-bin-hadoop3.tgz \
    | tar xz -C /opt/ && \
    mv /opt/spark-3.5.0-bin-hadoop3 /opt/spark && \
    ln -s /opt/spark/bin/spark-submit /usr/local/bin/

ENV SPARK_HOME=/opt/spark
ENV PATH=$SPARK_HOME/bin:$PATH

# Copy your Spark app and data
COPY app/ /app/

# Default command to run the Spark job
CMD ["spark-submit", "/app/spark_app.py"]