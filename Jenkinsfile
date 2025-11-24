stage('Deploy') {
    steps {
        echo "Deploying with pm2..."
        sh '''
            pm2 stop lsap-app || true
            pm2 start server.js --name lsap-app
        '''
    }
}

