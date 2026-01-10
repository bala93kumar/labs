 What we’ll deploy

1× Spark Master (lightweight: 1 core, low RAM)
2× Spark Workers (each advertises 4 cores and 6 GB to Spark)
1× Spark History Server (for timelines & stage metrics)
1× Spark Client (driver container where you run spark-submit)

spark master 

http://localhost:8080/

spark history server 
http://localhost:18080/


spark running job current on 

http://localhost:4040/jobs/


You can add a third worker later if you want even more throughput; I’ve included that block commented for convenience.

📁 Project structure (expected)


your-project/
├─ docker-compose.yml
├─ conf/
│  └─ spark-defaults.conf
├─ src/
│  └─ spark_job.py            # <— your code
├─ data/
│  └─ sample_data.csv         # columns: id, category, value
├─ output/
└─ events/


docker compose up -d --remove-orphans

to down the containers 

$ docker compose down -v


mount | grep /opt


mount | grep /opt


time spark-submit \
  --master spark://spark-master:7077 \
  --deploy-mode client \
  --name distributed_mode_test \
  --executor-cores 2 \
  --executor-memory 2g \
  --total-executor-cores 6 \
  --conf spark.sql.shuffle.partitions=24 \
  --conf spark.eventLog.enabled=true \
  --conf spark.eventLog.dir=/opt/spark-events \
   /opt/app/spark_job.py


   use this 

   spark-submit \
  --master local[4] \
  /opt/app/spark_job.py \
  --task agg \
  --partitions 4

  distributed 

  spark-submit \
  --master spark://spark-master:7077 \
  --executor-cores 2 \
  --executor-memory 2g \
  --total-executor-cores 6 \
  /opt/app/spark_job.py \
  --task agg \
  --partitions 24