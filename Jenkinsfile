pipeline {
    agent any
    tools {
        nodejs 'nodejs 23.3'
    }

    environment {
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

        stage('Deploy') {
            steps {
                script {
                    echo "Deploying React app with Nginx..."

                    // Nginx 프로세스 종료 시도
                    echo "Stopping any running Nginx processes..."
                    bat '''
                        taskkill /F /IM nginx.exe || echo "Nginx is not running or already stopped."
                        exit 0
                    '''

                    // 빌드된 파일을 Nginx의 html 디렉토리로 복사
                    echo "Copying build files to Nginx HTML directory..."
                    bat "echo BUILD_DIR: ${BUILD_DIR}"
                    bat "echo NGINX HTML DIR: C:\\Program Files\\nginx\\html\\"
                    bat "xcopy /E /I /Y \"${BUILD_DIR}\" \"C:\\Program Files\\nginx\\html\\\""

                    // Nginx 실행
                    echo "Starting Nginx..."
                    bat "\"${NGINX_PATH}\\nginx.exe\" -c \"${NGINX_CONF}\" || echo 'Failed to start Nginx.'"
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
