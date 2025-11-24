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

        stage('Start server (dev only)') {
            when {
                branch 'feat/time'
            }
            steps {
                sh 'node server.js &'
            }
        }

        // 🚀 deploy to server after tests pass
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sshagent(credentials: ['jenkins']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no classuser@localhost "
                            cd ~/lsap-cicd-example-app &&
                            git pull origin main &&
                            pm2 restart server 2>/dev/null || pm2 start server.js --name server
                        "
                    '''
                }
            }
        }
    }
}

