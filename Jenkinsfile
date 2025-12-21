pipeline {
  agent any

  environment {
    // 1) 改成你的 Docker Hub repo: <dockerhub_user>/<repo>
    DOCKER_IMAGE = 'phanatic34/lsap-cicd-example-app'

    // 2) 你的 app listen 的 port（你舊檔是 3000）
    APP_PORT = '3000'

    DEV_PORT  = '8081'
    PROD_PORT = '8082'

    // 3) 改成你的真實資料（fail 通知必須包含）
    STUDENT_NAME = '周建凱'
    STUDENT_ID   = 'B12705021'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps { sh 'npm ci' }
    }

    // 必須：所有 branch 都跑，lint fail 就 fail
    stage('Static Analysis') {
      steps { sh 'npm run lint' }
    }

    stage('Test') {
      steps { sh 'npm test' }
    }

    // dev: build + push dev-${BUILD_NUMBER}
    stage('Build & Push (dev)') {
      when { branch 'dev' }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                                          usernameVariable: 'DH_USER',
                                          passwordVariable: 'DH_PASS')]) {
          sh '''
            set -e
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            docker build -t ${DOCKER_IMAGE}:dev-${BUILD_NUMBER} .
            docker push ${DOCKER_IMAGE}:dev-${BUILD_NUMBER}
          '''
        }
      }
    }

    // dev: deploy dev-app on 8081 + verify /health
    stage('Deploy & Verify (dev)') {
      when { branch 'dev' }
      steps {
        sh '''
          set -e
          docker rm -f dev-app || true
          docker run -d --name dev-app -p ${DEV_PORT}:${APP_PORT} ${DOCKER_IMAGE}:dev-${BUILD_NUMBER}
          curl -fsS http://localhost:${DEV_PORT}/health
        '''
      }
    }

    // main: promotion only (NO build). read deploy.config -> pull/tag/push prod-${BUILD_NUMBER}
    stage('Promote (main)') {
      when { branch 'main' }
      steps {
        script {
          env.TARGET_TAG = sh(script: "tr -d '\\r\\n' < deploy.config", returnStdout: true).trim()
        }
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                                          usernameVariable: 'DH_USER',
                                          passwordVariable: 'DH_PASS')]) {
          sh '''
            set -e
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin

            docker pull ${DOCKER_IMAGE}:${TARGET_TAG}
            docker tag  ${DOCKER_IMAGE}:${TARGET_TAG} ${DOCKER_IMAGE}:prod-${BUILD_NUMBER}
            docker push ${DOCKER_IMAGE}:prod-${BUILD_NUMBER}
          '''
        }
      }
    }

    // main: deploy prod-app on 8082 + verify /health
    stage('Deploy & Verify (main)') {
      when { branch 'main' }
      steps {
        sh '''
          set -e
          docker rm -f prod-app || true
          docker run -d --name prod-app -p ${PROD_PORT}:${APP_PORT} ${DOCKER_IMAGE}:prod-${BUILD_NUMBER}
          curl -fsS http://localhost:${PROD_PORT}/health
        '''
      }
    }
  }

  post {
    failure {
      script {
        def repoUrl = (env.GIT_URL ?: sh(script: "git config --get remote.origin.url || true", returnStdout: true).trim())
        def msg = """Name: ${env.STUDENT_NAME}
Student ID: ${env.STUDENT_ID}
Job Name: ${env.JOB_NAME}
Build Number: ${env.BUILD_NUMBER}
GitHub Repo URL: ${repoUrl}
Branch: ${env.BRANCH_NAME}
Status: ${currentBuild.currentResult}"""
        def payload = groovy.json.JsonOutput.toJson([content: msg])

        withCredentials([string(credentialsId: 'chatops-webhook', variable: 'WEBHOOK_URL')]) {
          sh """curl -s -H 'Content-Type: application/json' -d '${payload}' '${WEBHOOK_URL}' || true"""
        }
      }
    }
  }
}
