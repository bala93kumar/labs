#!/usr/bin/env bash

# Spark environment variables for cluster setup

# Memory settings
export SPARK_WORKER_MEMORY=1G
export SPARK_DRIVER_MEMORY=1G
export SPARK_EXECUTOR_MEMORY=1G

# Master and Worker settings
export SPARK_MASTER_HOST=spark-master
export SPARK_MASTER_PORT=7077
export SPARK_MASTER_WEBUI_PORT=8080

# Worker settings
export SPARK_WORKER_PORT=7078
export SPARK_WORKER_WEBUI_PORT=8081
export SPARK_WORKER_CORES=2

# Python
export PYSPARK_PYTHON=/usr/bin/python3
export PYSPARK_DRIVER_PYTHON=/usr/bin/python3

# Disable native-hadoop warning
export LD_LIBRARY_PATH=$SPARK_HOME/lib:$LD_LIBRARY_PATH
