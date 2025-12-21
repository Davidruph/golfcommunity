// enviroments
const environment = {
  production: {
    API_BASE_URL: 'https://api.golfcommunity.app/',
  },
  development: {
    API_BASE_URL: 'http://localhost:3000/api/v1',
  },
}

const currentEnvironment = 'development'

export default environment[currentEnvironment]
