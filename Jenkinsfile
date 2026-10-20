// Unified DevOps Automation — Autonomous 9-Stage CI/CD Pipeline
// Project: DAM-DIGITAL-SIMULATOR | Target: Azure Kubernetes Service (AKS)

pipeline {
    agent {
        label 'kubernetes-runner'
    }

    environment {
        REGISTRY = 'ghcr.io/khandaitpiyush'
        IMAGE_NAME = 'DAM-DIGITAL-SIMULATOR'
        NAMESPACE = 'production'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        SONAR_PROJECT_KEY = "DAM-DIGITAL-SIMULATOR"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '50'))
        disableConcurrentBuilds()
    }

    stages {
        stage('1. Checkout Source') {
            steps {
                echo "Fetching repository source code..."
                checkout scm
            }
        }

        stage('2. Install Dependencies') {
            steps {
                echo "Restoring dependencies from lockfile..."
                sh 'npm ci --prefer-offline'
            }
        }

        stage('3. Run Tests & Lint') {
            steps {
                echo "Executing unit tests and static type checking..."
                sh 'npm run lint && npm test'
            }
        }

        stage('4. SonarQube Analysis') {
            when {
                expression { return true; }
            }
            steps {
                withSonarQubeEnv('SonarQube-Server') {
                    sh 'sonar-scanner -Dsonar.projectKey=${SONAR_PROJECT_KEY} -Dsonar.sources=src'
                }
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('5. Trivy Security Scan') {
            when {
                expression { return true; }
            }
            steps {
                echo "Scanning container and dependencies for CVEs..."
                sh 'trivy fs --severity CRITICAL,HIGH --exit-code 1 --no-progress .'
            }
        }

        stage('6. Build Docker Image') {
            steps {
                echo "Building container image ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}..."
                sh "docker build -t ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} -t ${REGISTRY}/${IMAGE_NAME}:latest ."
            }
        }

        stage('7. Push Image to GHCR') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'ghcr-credentials', usernameVariable: 'GHCR_USER', passwordVariable: 'GHCR_TOKEN')]) {
                    sh "echo ${GHCR_TOKEN} | docker login ghcr.io -u ${GHCR_USER} --password-stdin"
                    sh "docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "docker push ${REGISTRY}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('8. Deploy to Kubernetes') {
            steps {
                echo "Applying Kubernetes manifests to namespace ${NAMESPACE}..."
                sh "kubectl apply -f k8s/ -n ${NAMESPACE}"
                sh "kubectl set image deployment/${IMAGE_NAME} ${IMAGE_NAME}=${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} -n ${NAMESPACE}"
                sh "kubectl rollout status deployment/${IMAGE_NAME} -n ${NAMESPACE} --timeout=120s"
            }
        }

        stage('9. Record Telemetry & Metadata') {
            steps {
                echo "Recording execution metrics to Platform Observability Hub..."
                sh "curl -s -X POST http://devops-api.internal:5000/api/pipelines/telemetry -d '{\"build\": \"${IMAGE_TAG}\", \"status\": \"success\"}' -H 'Content-Type: application/json'"
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            echo "Pipeline failed. Alerting engineering team via webhook..."
        }
    }
}