import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '9dvoysnt',
    dataset: 'production',
  },
  deployment: {
    appId: 'panama-fm-admin',
  },
})
