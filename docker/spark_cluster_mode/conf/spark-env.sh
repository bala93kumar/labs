
#!/usr/bin/env bash

############################################
# Spark Environment Config for Docker Cluster
############################################

# Path where Spark is installed (matches container path)
export SPARK_HOME=/opt/spark

# Mandatory to avoid binding issues
export SPARK_MASTER_HOST=spark-master

# Worker resource settings (must match docker-compose)
export SPARK_WORKER_CORES=4
export SPARK_WORKER_MEMORY=6g

# Logging dir inside container
export SPARK_LOG_DIR=/opt/spark/logs

# Optional: reduce noisy logs
export SPARK_DAEMON_MEMORY=1g
