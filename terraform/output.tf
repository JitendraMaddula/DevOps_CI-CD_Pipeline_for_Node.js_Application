output "instance_public_ip" {
  value = aws_instance.example.public_ip
}

output "repository_url" {
  value = aws_ecr_repository.example.repository_url
}
