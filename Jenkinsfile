pipeline {
    agent any

    tools {
        nodejs "NodeJS-18"   // must match the name in Jenkins → Manage Jenkins → Tools
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}

