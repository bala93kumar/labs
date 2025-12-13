from pyspark.sql import SparkSession

def main():
    spark = SparkSession.builder.appName("SimpleCSVApp").getOrCreate()

    # Read CSV
    df = spark.read.csv("sample_data.csv", header=True, inferSchema=True)

    # Show contents
    print("=== Raw Data ===")
    df.show()

    # Do a simple transformation: filter age > 30
    print("=== Filtered Data (age > 30) ===")
    df.filter(df.age > 30).show()

    spark.stop()

if __name__ == "__main__":
    main()
