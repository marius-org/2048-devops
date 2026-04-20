# 2048 Game — Full DevOps Pipeline

A modern 2048 browser game deployed on AWS using a complete DevOps pipeline.
Built with FastAPI, PostgreSQL, Docker, Terraform, Ansible, and GitHub Actions.

## Live Demo

http://52.213.214.75:8200

## Architecture

    GitHub Push → GitHub Actions → Docker Hub → Terraform (AWS) → Ansible → Live App

**Stack:**
- **App:** Python + FastAPI + PostgreSQL
- **Container:** Docker + Docker Hub
- **Infrastructure:** AWS EC2 t3.micro + AWS RDS PostgreSQL
- **Provisioning:** Terraform with S3 remote state
- **Configuration:** Ansible with dynamic AWS inventory
- **CI/CD:** GitHub Actions

## Repository Structure

    2048-devops/
    ├── app/                    # FastAPI application
    │   ├── main.py             # API endpoints
    │   ├── models.py           # Database models
    │   ├── schemas.py          # Pydantic schemas
    │   ├── database.py         # Database connection
    │   └── static/             # Game UI (HTML, CSS, JS)
    ├── terraform/              # Infrastructure as Code
    │   ├── modules/
    │   │   ├── app-vm/         # EC2 instance module
    │   │   └── rds/            # RDS PostgreSQL module
    │   ├── main.tf             # Root configuration
    │   ├── variables.tf        # Variable declarations
    │   └── outputs.tf          # Output values
    ├── ansible/                # Configuration management
    │   ├── playbook.yml        # Deployment playbook
    │   ├── aws_ec2.yml         # Dynamic inventory
    │   └── ansible.cfg         # Ansible configuration
    ├── .github/
    │   └── workflows/
    │       └── pipeline.yml    # CI/CD pipeline
    ├── Dockerfile              # Container definition
    ├── docker-compose.yml      # Local development
    └── requirements.txt        # Python dependencies

## Prerequisites

- AWS account with credentials configured
- Docker and Docker Hub account
- Terraform >= 1.0
- Ansible >= 2.12
- Python3 + boto3

## Local Development

    git clone https://github.com/marius-org/2048-devops.git
    cd 2048-devops
    docker compose up --build -d
    open http://localhost:8200

## CI/CD Pipeline

The pipeline runs automatically on every push to main:

**Job 1 — Build and Push Docker Image:**
- Builds Docker image from source
- Pushes to Docker Hub as mariuseu/2048-game:latest

**Job 2 — Terraform:**
- Provisions EC2 t3.micro instance running Ubuntu 24.04
- Provisions RDS PostgreSQL db.t3.micro
- Generates ED25519 SSH key pair automatically
- Stores state remotely in AWS S3

**Job 3 — Ansible:**
- Discovers EC2 instance via dynamic AWS inventory by tag
- Installs Docker on the instance
- Pulls latest image from Docker Hub
- Deploys container connected to RDS

## Manual Deployment

    export TF_VAR_db_password="yourpassword"

    cd terraform
    terraform init
    terraform apply

    cd ../ansible
    ansible-playbook playbook.yml \
      --extra-vars "db_host=<rds_endpoint> db_name=game2048 db_username=postgres db_password=yourpassword"

## GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| AWS_ACCESS_KEY_ID | AWS access key |
| AWS_SECRET_ACCESS_KEY | AWS secret key |
| DB_PASSWORD | RDS database password |
| DOCKERHUB_USERNAME | Docker Hub username |
| DOCKERHUB_TOKEN | Docker Hub access token |

## Infrastructure

| Resource | Type | Purpose |
|----------|------|---------|
| EC2 | t3.micro | Application server |
| RDS | db.t3.micro PostgreSQL | Database |
| S3 | Standard | Terraform state |
| Elastic IP | Static | Stable public IP |
| Security Groups | Firewall | Network access control |

## Destroy Infrastructure

    cd terraform
    terraform destroy

## Author

Marius 