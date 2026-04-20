terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }

  backend "s3" {
    bucket  = "2048-devops-terraform-state"
    key     = "prod/terraform.tfstate"
    region  = "eu-west-1"
    encrypt = true
  }
}

provider "aws" {
  region = var.aws_region
}

module "app_vm" {
  source        = "./modules/app-vm"
  instance_type = var.instance_type
  key_name      = var.key_name
  app_name      = var.app_name
  aws_region    = var.aws_region
}

module "rds" {
  source                = "./modules/rds"
  db_name               = var.db_name
  db_username           = var.db_username
  db_password           = var.db_password
  db_instance_class     = var.db_instance_class
  app_name              = var.app_name
  ec2_security_group_id = module.app_vm.security_group_id
}