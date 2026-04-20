output "app_public_ip" {
  description = "Public IP of the app server"
  value       = module.app_vm.public_ip
}

output "app_url" {
  description = "URL to access the 2048 game"
  value       = "http://${module.app_vm.public_ip}:8200"
}

output "ssh_connection" {
  description = "SSH command to connect to the server"
  value       = "ssh -i ansible/ssh_key.pem ubuntu@${module.app_vm.public_ip}"
}

output "ami_used" {
  description = "AMI ID that was used"
  value       = module.app_vm.ami_id
}

output "db_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = module.rds.db_endpoint
}

output "db_name" {
  description = "Database name"
  value       = module.rds.db_name
}