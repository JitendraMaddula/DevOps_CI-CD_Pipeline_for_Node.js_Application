
# DevOps_CI-CD_Pipeline_for_Node.js_Application

This project demonstrates a DevOps pipeline for automating the deployment of a Node.js application using Terraform, Ansible, Jenkins, Helm, and Kubernetes.

## Steps to Set Up the Pipeline

1. Clone the Git repository:

   ```bash
   git clone https://github.com/JitendraMaddula/DevOps_CI-CD_Pipeline_for_Node.js_Application.git
   ```

2. Move to the Terraform folder and run:

   ```bash
   terraform init
   terraform apply
   ```

3. The Terraform script will output the instance IP. Save it for future reference.

4. Move to the Ansible folder, update the `inventory.ini` file with the EC2 instance IP, and run:

   ```bash
   ansible-playbook -i inventory.ini site.yml -vvv
   ```

   The Ansible script will be executed, and the `initialAdminPassword` file will be created.

5. Create an IAM role with admin access and assign it to the EC2 instance and EKS cluster.

6. Connect to the EC2 instance and run the following commands:

   **To install AWS CLI:**

   ```bash
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   sudo apt install unzip
   sudo unzip awscliv2.zip
   sudo ./aws/install
   aws --version
   ```

   **To install Helm:**

   ```bash
   curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
   sudo chmod 700 get_helm.sh
   sudo ./get_helm.sh
   helm version --client
   ```

   **To install kubectl:**

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   chmod +x kubectl
   sudo mv kubectl /usr/local/bin/
   kubectl version --client --output=yaml
   aws eks update-kubeconfig --region us-east-1 --name nodejs_cluster
   kubectl create ns nodejs-helm-deployment
   ```

   **Configure Kubernetes for Jenkins:**

   ```bash
   sudo mkdir -p /var/lib/jenkins/.kube
   sudo cp ~/.kube/config /var/lib/jenkins/.kube/config
   sudo chown -R jenkins:jenkins /var/lib/jenkins/.kube
   ls -l /var/lib/jenkins/.kube/config
   ```

### Step 8: Jenkins Setup
1. Open Jenkins using the EC2 instance IP with port 8080.
2. Install required plugins like Docker.
3. Create a new Jenkins pipeline and paste the Jenkinsfile content.

### Step 9: Kubernetes & Helm Deployment
Check the Helm deployment and Kubernetes pods:

```bash
helm ls -n nodejs-helm-deployment
kubectl get pods -n nodejs-helm-deployment
kubectl logs <Pod_Name> -n nodejs-helm-deployment
```

## Conclusion
Once you complete the above steps, the DevOps pipeline will be set up for automating the deployment of the Node.js application.
