variable "db_name" {
  description = "Database name"
  type        = string
  default     = "game2048"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "app_name" {
  description = "Application name for tagging"
  type        = string
  default     = "2048-game"
}

variable "ec2_security_group_id" {
  description = "Security group ID of EC2 instance to allow access"
  type        = string
}