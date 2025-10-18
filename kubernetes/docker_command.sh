######

##command to check what docker packages are installed. 

dpkg -l | grep docker-ce


root@dockerserver:~# dpkg -l | grep docker-ce
ii  docker-ce                              5:28.5.1-1~ubuntu.22.04~jammy           amd64        Docker: the open-source application container engine
ii  docker-ce-cli                          5:28.5.1-1~ubuntu.22.04~jammy           amd64        Docker CLI: the open-source application container engine
ii  docker-ce-rootless-extras              5:28.5.1-1~ubuntu.22.04~jammy           amd64        Rootless support for Docker.
root@dockerserver:~# ^C

root@dockerserver:~# dpkg -l |grep container
ii  containerd.io                          1.7.28-1~ubuntu.22.04~jammy             amd64        An open and reliable container runtime
ii  docker-ce                              5:28.5.1-1~ubuntu.22.04~jammy           amd64        Docker: the open-source application container engine
ii  docker-ce-cli                          5:28.5.1-1~ubuntu.22.04~jammy           amd64        Docker CLI: the open-source application container engine
root@dockerserver:~# dpkg -l | grep docker-compose-plugin
ii  docker-compose-plugin                  2.40.1-1~ubuntu.22.04~jammy             amd64        Docker Compose (V2) plugin for the Docker CLI.

docker info


root@dockerserver:~# ls -l ~/.docker
ls: cannot access '/root/.docker': No such file or directory

# add a testuser to the root docker group so that docker commands can be executed without sudo

root@dockerserver:~# cat /etc/group | grep docker
docker:x:999:
root@dockerserver:~# ls
snap  vboxpostinstall.sh
root@dockerserver:~# usermod -aG docker testuser
root@dockerserver:~# cat /etc/group | grep docker
docker:x:999:testuser
root@dockerserver:~#

# do a reboot after this

#docker  socket used by docker cli to communicate with docker daemon
testuser@dockerserver:~$ cat /var/run/docker.sock
cat: /var/run/docker.sock: No such device or address
testuser@dockerserver:~$ ls /var/run/docker.sock
/var/run/docker.sock
testuser@dockerserver:~$ cd /var/run/docker.sock/
-bash: cd: /var/run/docker.sock/: Not a directory
testuser@dockerserver:~$ sudo i
[sudo] password for testuser:
sudo: i: command not found
testuser@dockerserver:~$ ls -l /var/run/docker.sock
srw-rw---- 1 root docker 0 Oct 18 11:23 /var/run/docker.sock
testuser@dockerserver:~$ stat  /var/run/docker.sock
  File: /var/run/docker.sock
  Size: 0               Blocks: 0          IO Block: 4096   socket
Device: 18h/24d Inode: 1076        Links: 1
Access: (0660/srw-rw----)  Uid: (    0/    root)   Gid: (  999/  docker)
Access: 2025-10-18 11:23:35.363999574 +0000
Modify: 2025-10-18 11:23:16.931999856 +0000
Change: 2025-10-18 11:23:16.931999856 +0000

# pull nginx image

root@dockerserver:~# docker pull nginx
Using default tag: latest
latest: Pulling from library/nginx
8c7716127147: Pull complete
250b90fb2b9a: Pull complete
5d8ea9f4c626: Pull complete
58d144c4badd: Pull complete
b459da543435: Pull complete
8da8ed3552af: Pull complete
54e822d8ee0c: Pull complete
Digest: sha256:3b7732505933ca591ce4a6d860cb713ad96a3176b82f7979a8dfa9973486a0d6
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest
root@dockerserver:~# docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
root@dockerserver:~# docker image ls
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE

# how to get container IP 

docker container run -d nginx
 docker ps -a
curl 172.17.0.2
ip a
docker ps -a (get container id or name)
docker container inspect bold_pasteur (you will get json , here grep IPAddress that is the nginx IP)
docker container inspect bold_pasteur | grep IPAddress

#stop container 
docker container stop bold_pasteur

# to start the container again
docker container start bold_pasteur

# to restart the container
docker container restart bold_pasteur

# We are now going to see other options of docker run command with parameters