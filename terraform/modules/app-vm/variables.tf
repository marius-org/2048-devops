variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "SSH key pair name on AWS"
  type        = string
}


variable "app_name" {
  description = "Application name used for tagging"
  type        = string
  default     = "2048-game"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-1"
}