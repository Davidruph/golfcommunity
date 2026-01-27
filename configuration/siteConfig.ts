// enviroments
const environment = {
  production: {
    API_BASE_URL: 'https://golfcommunity-plum.vercel.app/api/v1',
  },
  development: {
    API_BASE_URL: 'http://localhost:3000/api/v1',
  },
}

const currentEnvironment = 'production'

export default environment[currentEnvironment]
