throttle(['throttleDocker']) {
  node('agent1') {
    wrap([$class: 'AnsiColorBuildWrapper']) {
      try{
        stage('Setup') {
          checkout scm
          sh '''
            ./system/fuge/ci/docker-down.sh
            ./system/fuge/ci/docker-up.sh
          '''
        }
      }
      finally {
        stage('Cleanup') {
          sh '''
            ./system/fuge/ci/docker-down.sh
          '''
        }
      }
    }
  }
}