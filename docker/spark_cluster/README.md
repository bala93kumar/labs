# Spark Distributed Cluster Setup

This setup creates a Spark cluster with 1 Master and 3 Worker nodes running in Docker containers.

## Directory Structure
```
spark_cluster/
├── Dockerfile
├── docker-compose.yml
├── spark-env.sh
├── workers
├── app/
│   └── distributed_app.py
└── README.md
```

## Quick Start

### 1. Start the Cluster
```powershell
docker-compose up -d
```

This will start:
- **spark-master**: Master node
- **spark-worker-1, spark-worker-2, spark-worker-3**: Worker nodes

### 2. Check Cluster Status
```powershell
# View master Web UI
# Open http://localhost:8080 in browser

# Check logs
docker-compose logs -f spark-master
docker-compose logs -f spark-worker-1
```

### 3. Submit a Spark Job to Cluster

```powershell
# Method 1: Submit from host (requires spark-submit)
spark-submit --master spark://localhost:7077 \
  --deploy-mode client \
  ./app/distributed_app.py

# Method 2: Submit from master container
docker exec spark-master $SPARK_HOME/bin/spark-submit \
  --master spark://spark-master:7077 \
  --deploy-mode client \
  /app/distributed_app.py
```

## Port Mappings

| Service | Container Port | Host Port | Purpose |
|---------|----------------|-----------|---------|
| spark-master | 8080 | 8080 | Master Web UI |
| spark-master | 7077 | 7077 | Master RPC |
| spark-master | 6066 | 6066 | REST API |
| spark-master | 4040 | 4040 | Application UI |
| spark-worker-1 | 8081 | 8081 | Worker-1 Web UI |
| spark-worker-2 | 8081 | 8082 | Worker-2 Web UI |
| spark-worker-3 | 8081 | 8083 | Worker-3 Web UI |

## Key Configuration

### spark-env.sh
- `SPARK_WORKER_MEMORY=1G`: Memory per worker
- `SPARK_WORKER_CORES=2`: Cores per worker
- `SPARK_MASTER_HOST=spark-master`: Master hostname (uses service name)

### Docker Compose
- **Network**: spark-network (bridge network for inter-container communication)
- **Volumes**: ./app mounted to /app in all containers
- **Dependencies**: Workers depend on master startup

## Scaling

To add more workers, add new service definitions in docker-compose.yml:

```yaml
spark-worker-4:
  build: .
  container_name: spark-worker-4
  hostname: spark-worker-4
  environment:
    - SPARK_MODE=worker
    - SPARK_MASTER_URL=spark://spark-master:7077
  ...
```

Then rebuild and restart:
```powershell
docker-compose up -d
```

## Cleanup

```powershell
# Stop all containers
docker-compose down

# Remove images and volumes
docker-compose down -v --rmi all
```

## Monitoring

### Web UIs
- **Master UI**: http://localhost:8080
- **Worker-1 UI**: http://localhost:8081
- **Worker-2 UI**: http://localhost:8082
- **Worker-3 UI**: http://localhost:8083
- **Application UI**: http://localhost:4040 (appears during job execution)

### Logs
```powershell
# All services
docker-compose logs

# Specific service
docker-compose logs spark-master
docker-compose logs spark-worker-1

# Follow logs
docker-compose logs -f
```

## Troubleshooting

### Workers not connecting to master
```powershell
# Check network connectivity
docker exec spark-worker-1 ping spark-master

# Check logs
docker-compose logs spark-worker-1
```

### Port already in use
Change host ports in docker-compose.yml:
```yaml
ports:
  - "9080:8080"  # Changed from 8080
```

### SSH issues (if using SSH for communication)
```powershell
docker exec spark-master ssh spark-worker-1 "echo 'SSH working'"
```

## Example: Submit and Monitor Job

1. Start cluster:
   ```powershell
   docker-compose up -d
   ```

2. Submit job:
   ```powershell
   docker exec spark-master bash -c \
     "$SPARK_HOME/bin/spark-submit --master spark://spark-master:7077 /app/distributed_app.py"
   ```

3. Monitor:
   - Check Master UI: http://localhost:8080
   - Check Application UI: http://localhost:4040
   - View logs: `docker-compose logs -f`

4. Stop cluster:
   ```powershell
   docker-compose down
   ```
