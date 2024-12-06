pipeline {
    agent any

    environment {
        // React 프로젝트의 경로
        REACT_DIR = 'C:\\ProgramData\\Jenkins\\workspace\\workspace\\board-client\\'
        BUILD_DIR = 'C:\\ProgramData\\Jenkins\\workspace\\workspace\\board-client\\dist'
        NGINX_PATH = 'C:\\Program Files\\nginx'
        NGINX_CONF = 'C:\\Program Files\\nginx\\conf\\nginx.conf'
        NGINX_LOGS = 'C:\\Program Files\\nginx\\logs'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'dev', url: 'https://github.com/boardmaking/board-front.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    dir(REACT_DIR) {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    dir(REACT_DIR) {
                        bat 'npm run build'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    dir(REACT_DIR) {
                        bat 'npm test -- --watchAll=false'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                echo "Deploying React app with Nginx..."
                                    echo "Stopping any running Nginx processes..."
                                    bat "taskkill /F /IM nginx.exe || echo 'Nginx is not running.'"

                                    echo "Copying build files to Nginx HTML directory..."
                                    bat "xcopy /E /I /Y ${BUILD_DIR} C:\\Program Files\\nginx\\html\\"
                                    echo "Starting Nginx..."
                                    bat "\"${NGINX_PATH}\\nginx.exe\" -c \"${NGINX_CONF}\""
                }
            }
        }
    }

    post {
        success {
            echo 'React application has been successfully built and deployed.'
        }
        failure {
            echo 'React application build or deployment failed.'
        }
    }
}
