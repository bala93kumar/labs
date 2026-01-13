
docker compose up -d --remove-orphans
docker compose ps

#then login to the container 

docker logs spark-history


✅ Submit a job with event logging enabled

docker exec -it spark-local bash

spark-submit \
  --master local[*] \
  --conf spark.eventLog.enabled=true \
  --conf spark.eventLog.dir=/opt/spark-events \
  /opt/app/spark_job.py \
  --task agg \
  --input /opt/data/sample_data.csv \
  --output /opt/output \
  --partitions 4


During run: open http://localhost:4040 (driver UI).
After completion: open http://localhost:18080 (History UI) to see the completed job.