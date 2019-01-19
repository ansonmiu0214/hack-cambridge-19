const fs = require('fs')
const rp = require('request-promise')


const LOCATION = 'trial'
const ACCOUNT_ID = 'b9728b99-b18a-4c83-9b52-06ae9fe466d3'
const SUBSCRIPTION_KEY = 'd116cd55f26040e58f5dfaa0bee74547'
const DEFAULT_NAME = 'myInterview'

const buildURL = (accessToken) => `https://api.videoindexer.ai/${LOCATION}/Accounts/${ACCOUNT_ID}/Videos?accessToken=${accessToken}&name=${DEFAULT_NAME}`

const getAccessToken = async () => {
  const accessTokenOptions = {
    uri: `https://api.videoindexer.ai/auth/${LOCATION}/Accounts/${ACCOUNT_ID}/AccessToken?allowEdit=true`,
    headers: {
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
    }
  }

  try {
    const payload = await rp.get(accessTokenOptions)
    const accessToken = payload.substring(1, payload.length - 1)
    return {
      error: false,
      message: accessToken
    }

  } catch (exception) {
    return {
      error: true,
      message: exception
    }
  }
}

const postVideo = async (req, res, next) => {
  const { error, message }  = await getAccessToken()
  if (error) {
    console.error(message)
    return res.status(500).send(message)
  }

  console.log(message)

  const uri = buildURL(accessToken = message)
  console.log(uri)

  const options = {
    method: 'POST',
    uri: uri,
    formData: {
      file: {
        value: fs.createReadStream('cars.mp4'),
        options: {
          filename: 'cars.mp4',
          contentType: 'video/mp4'
        }
      }
    },
    headers: {
      'content-type': 'multipart/form-data'
    }
  }


  try {
    const data = await rp.post(options)
    console.log(data)
    res.json(data)
  } catch (reject) {
    console.error(reject)
    res.json(reject)
  }
}

module.exports = {
  postVideo: postVideo
}

// https://api.videoindexer.ai/{location}/Accounts/{accountId}/Videos?accessToken={accessToken}&name={name}[&description][&partition][&externalId][&callbackUrl][&metadata][&language][&videoUrl][&fileName][&indexingPreset][&streamingPreset][&linguisticModelId][&privacy][&externalUrl][&assetId][&priority][&personModelId][&brandsCategories]

