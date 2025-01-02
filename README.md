# DevOps_CI-CD_Pipeline_for_Node.js_Application


# DevOps_CI-CD_Pipeline_for_Node.js_Application

# DevOps_CI-CD_Pipeline_for_Node.js_Application
Step1
create file structre

step 2
terraform script to create ec2 instance
 commands used terraformm init, terraform plan, terraform apply

 step3
 ansible script
 commands used mkdir inventory.ini,mkdir site.yml, ansible-galaxy init nodejsapp, ansible-playbook -i inventory.ini site.yml, ansible-playbook -i inventory.ini site.yml -vvv, 

 

 1. clone the git repository https://github.com/JitendraMaddula/DevOps_CI-CD_Pipeline_for_Node.js_Application.git
 2. move to terraform folder and run the commands terraform init, terraform apply
 3. you can see the terraform script ran successfully by giving output of instance ip and  save those for future reference
 4. move to ansible folder and update the copied instance ip address in inventory.ini and run the command ansible-playbook -i inventory.ini site.yml -vvv
 5. ansible script will be ran and initialAdminPassword file will be created with jenkins password
 5. creat a IAM role with admin access and add this to created instance and also EKS cluster
 6. connect to  instance and use the below commands
    to install aws cli:
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" 
        sudo apt install unzip
        sudo unzip awscliv2.zip  
        sudo ./aws/install
        aws --version

    to install helm:
        curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
        sudo chmod 700 get_helm.sh
        sudo ./get_helm.sh
        helm version --client
    to install kubectl:
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
        chmod +x kubectl
        sudo mv kubectl /usr/local/bin/
        kubectl version --client --output=yaml
        aws eks update-kubeconfig --region us-east-1  --name nodejs_cluster
        kubectl create ns nodejs-helm-deployment

        sudo mkdir -p /var/lib/jenkins/.kube
        sudo cp ~/.kube/config /var/lib/jenkins/.kube/config
        sudo chown -R jenkins:jenkins /var/lib/jenkins/.kube
        ls -l /var/lib/jenkins/.kube/config
 7. open jenkins in ec2 using instance ip with port 8080 and install the required plugins like docker.
 8. create a new pipeline and paste the jenkins code




helm ls -n nodejs-helm-deployment
kubectl get pods -n nodejs-helm-deployment
kubectl logs first-nodes-chart-8dd7d6d8d-m6pqf -n nodejs-helm-deployment
