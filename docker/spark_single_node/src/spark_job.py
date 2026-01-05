
#!/usr/bin/env python3
"""
PySpark job for local (single-node) and standalone cluster.

Tasks:
  - agg: Read CSV, group by category, compute count and mean.
  - pi:  Monte Carlo estimation of Pi (CPU-bound), useful to see parallel speedup.

Usage examples:
  spark-submit --master local[*] spark_job.py --task agg --input /opt/data/sample_data.csv --output /opt/output --partitions 4
  spark-submit --master spark://spark-master:7077 spark_job.py --task pi --pi-samples 5000000 --partitions 8
"""
import argparse
import os
import time
import shutil
from pyspark.sql import SparkSession, functions as F
from pyspark import StorageLevel
import random

def run_agg(spark, input_path: str, output_path: str, partitions: int):
    t0 = time.time()
    df = spark.read.option("header", True).option("inferSchema", True).csv(input_path)
    df = df.repartition(partitions)
    df.persist(StorageLevel.MEMORY_AND_DISK)
    agg_df = df.groupBy("category").agg(
        F.count("id").alias("cnt"),
        F.round(F.avg("value"), 4).alias("avg_value")
    ).orderBy(F.col("cnt").desc())
    out_dir = os.path.join(output_path, "agg_result")
    if os.path.exists(out_dir):
        shutil.rmtree(out_dir)
    agg_df.coalesce(1).write.mode("overwrite").option("header", True).csv(out_dir)
    t1 = time.time()
    print(f"[AGG] Completed in {t1 - t0:.3f} s, partitions={partitions}")
    agg_df.show(10, truncate=False)

def run_pi(spark, samples: int, partitions: int):
    t0 = time.time()
    sc = spark.sparkContext
    def inside(_):
        x = random.random()
        y = random.random()
        return 1 if x*x + y*y <= 1.0 else 0
    hits = sc.parallelize(range(samples), partitions).map(inside).sum()
    pi_est = 4.0 * float(hits) / float(samples)
    t1 = time.time()
    print(f"[PI] samples={samples:,}, partitions={partitions}, pi≈{pi_est:.6f}, time={t1 - t0:.3f} s")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--task", choices=["agg", "pi"], default="agg")
    parser.add_argument("--input", default="/opt/data/sample_data.csv")
    parser.add_argument("--output", default="/opt/output")
    parser.add_argument("--partitions", type=int, default=4)
    parser.add_argument("--pi-samples", type=int, default=2000000)
    args = parser.parse_args()

    spark = SparkSession.builder.appName("docker-compose-spark-experiment").getOrCreate()
    master = spark.sparkContext.master
    print(f"Spark master: {master}")
    print(f"Executor cores conf (spark.executor.cores): {spark.conf.get('spark.executor.cores', 'default')}\n")

    if args.task == "agg":
        run_agg(spark, args.input, args.output, args.partitions)
    else:
        run_pi(spark, args.pi_samples, args.partitions)
    spark.stop()

if __name__ == "__main__":
    main()
