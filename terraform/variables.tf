variable "region" {
  description = "The AWS region to deploy resources"
  type        = string
}

variable "aws_instance_name" {
  description = "The name of the aws instanceg"
  type        = string
}

variable "repo_name" {
  description = "The name of the ECR"
  type        = string
}

variable "subnet_id_1" {
  type = string
 }

 variable "subnet_id_2" {
  type = string
 }

 variable "cluster_name" {
  type = string
 }