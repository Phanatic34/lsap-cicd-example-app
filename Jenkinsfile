pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run tests') {
            steps {
                sh 'npm test'
            }
        }

        // Start server for all branches (dev / feat/time)
        stage('Start server') {
            steps {
                sh 'node server.js &'
            }
        }

        // 🚀 Deploy only on dev branch
        stage('Deploy') {
            when {
                branch 'dev'
            }
            steps {
                sshagent(credentials: ['jenkins']) {
                    sh '''
                    docker stop lsap-app || true
                    docker rm lsap-app || true
                    docker build -t lsap-app .
                    docker run -d -p 8081:3000 --name lsap-app lsap-app
                    '''
                }
            }
        }
    }
}
