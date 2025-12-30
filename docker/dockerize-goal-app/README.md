## IN THIS PROJECT WE WILL BE CREATING A FULL STACK GOAL SETTING APP 

<!-- step 1 : create the mongodb container -->

# 1. create mongodb container or the goal app with a volumn mounted.-->
docker  run   -p 27017:27017 -d  --name mongodb-goalapp -v mongodb_data:/data/db   mongo:8.2.3

# to build the backend container 
 <!-- 'mongodb://host.docker.internal:27017/course-goals' -->
#2 . docker build -t goals-setting-app .
# to expose with the ports
#3. docker run -d -p 80:80  --name goals-backend   goals-setting-app 

#4 build the frontend app 
docker build -t goals-react 

#run the front end goals-react app by exposing the port 3000
docker run -d --name goals-frontend --rm  -p 3000:3000 --name goals-frontend-container goals-react

