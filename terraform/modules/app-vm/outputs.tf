output "public_ip" {
  description = "Public IP of the app server"
  value       = aws_eip.app.public_ip
}

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.app.id
}

output "ami_id" {
  description = "AMI ID used"
  value       = data.aws_ami.ubuntu.id
}

output "security_group_id" {
  description = "Security group ID of the EC2 instance"
  value       = aws_security_group.app.id
}