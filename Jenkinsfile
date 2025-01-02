pipeline {
    agent any

    environment {
        registry = "730335226293.dkr.ecr.us-east-1.amazonaws.com/nodejs_registry"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/JitendraMaddula/DevOps_CI-CD_Pipeline_for_Node.js_Application.git']])
            }
        }
        stage('Build image') {
            steps {
                script {
                    dockerImage = docker.build("${registry}:$BUILD_NUMBER")
                }
            }
        }
        stage('Push image') {
            steps {
                script {
                    sh "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${registry}"
                    sh "docker push ${registry}:$BUILD_NUMBER"
                }
            }
        }
        stage('Helm Deploy') {
            steps {
                script {
                    sh "helm upgrade first --install nodes-chart --namespace nodejs-helm-deployment --set image.tag=$BUILD_NUMBER"
                }
            }
        }
    }
}
