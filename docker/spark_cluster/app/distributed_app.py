from pyspark.sql import SparkSession
from pyspark import SparkConf

def main():
    # Create Spark session configured for cluster mode
    conf = SparkConf().setAppName("DistributedSparkApp") \
        .setMaster("spark://spark-master:7077") \
        .set("spark.executor.memory", "1g") \
        .set("spark.executor.cores", "2") \
        .set("spark.driver.memory", "1g")
    
    spark = SparkSession.builder.config(conf=conf).getOrCreate()
    
    print("=" * 60)
    print("Spark Cluster Information")
    print("=" * 60)
    print(f"App Name: {spark.sparkContext.appName}")
    print(f"Master: {spark.sparkContext.master}")
    print(f"Application ID: {spark.sparkContext.applicationId}")
    print(f"Default Parallelism: {spark.sparkContext.defaultParallelism}")
    print(f"Default Min Partitions: {spark.sparkContext.defaultMinPartitions}")
    print("=" * 60)
    
    # Create sample data and distribute across workers
    data = [("Alice", 25), ("Bob", 30), ("Charlie", 35), ("David", 40), ("Eve", 28)]
    
    # Create RDD with parallelism = number of partitions
    rdd = spark.sparkContext.parallelize(data, numPartitions=3)
    
    print(f"\nNumber of partitions: {rdd.getNumPartitions()}")
    print(f"Partitions location:")
    partitions = rdd.glom().collect()
    for i, partition in enumerate(partitions):
        print(f"  Partition {i}: {partition}")
    
    # Create DataFrame
    df = spark.createDataFrame(data, ["Name", "Age"])
    
    print("\n=== Raw Data ===")
    df.show()
    
    # Perform distributed operations
    print("\n=== Filtered Data (Age > 30) ===")
    df.filter(df.Age > 30).show()
    
    # Calculate statistics
    print("\n=== Statistics ===")
    df.agg({"Age": "avg", "Name": "count"}).show()
    
    spark.stop()
    print("\nDistributed job completed successfully!")

if __name__ == "__main__":
    main()
