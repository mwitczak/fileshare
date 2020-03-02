terraform {
  backend "s3" {
    bucket         = "terraform.state.fileshare.martinwitczak.com"
    region         = "eu-central-1"
    dynamodb_table = "terraform-lock"
    key            = "state"
  }
}

provider "aws" {
  region = "eu-central-1"
}

resource "aws_dynamodb_table" "dynamodb-terraform-lock" {
  name           = "terraform-lock"
  hash_key       = "LockID"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "LockID"
    type = "S"
  }
}

