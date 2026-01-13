---------

ONE TIME ACTIVITY 
-------------------
refer this git repo for all command. 
https://github.com/stacksimplify/azure-aks-kubernetes-masterclass/tree/master/01-Create-AKS-Cluster


windows install command 

winget install --exact --id Microsoft.AzureCLI

then install kubectl cli.

az aks install-cli

check the version installed. 

kubectl version --client


THEN Login to your account. azure account from cmd

az login. 

This will authenticate with your azure id and get the subscription id. 

az account list --output table

----------------------

with this all the configurations are done. 

now if you give the command 

kubectl version 
the result will give server version aswell. 

kubectl get nodes

kubectl get nodes -o wide

