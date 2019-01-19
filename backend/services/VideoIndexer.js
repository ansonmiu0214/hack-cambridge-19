const rp = require('request-promise')

const TextAnalytics = require('./TextAnalytics')

const LOCATION = 'trial'
const ACCOUNT_ID = 'b9728b99-b18a-4c83-9b52-06ae9fe466d3'
const SUBSCRIPTION_KEY = 'd116cd55f26040e58f5dfaa0bee74547'
const DEFAULT_NAME = 'myInterview'

/**
 * Returns payload of { error, message } where message contains access token iff error is false.
 */
const getAccessToken = async () => {
  const accessTokenOptions = {
    uri: `https://api.videoindexer.ai/auth/${LOCATION}/Accounts/${ACCOUNT_ID}/AccessToken?allowEdit=true`,
    headers: {
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
    }
  }

  try {
    const payload = await rp.get(accessTokenOptions)

    // Payload includes double quotes "..."  wrapping the token, need to remove
    const accessToken = payload.substring(1, payload.length - 1)
    return {
      error: false,
      data: accessToken
    }
  } catch (exception) {
    return {
      error: true,
      data: exception
    }
  }
}

const postVideo = async (videoName, videoFile) => {
  const payload = await getAccessToken()
  const { error, data } = payload
  if (error) return payload

  const endpoint = `https://api.videoindexer.ai/${LOCATION}/Accounts/${ACCOUNT_ID}/Videos?accessToken=${data}&name=${DEFAULT_NAME}`

  const options = {
    method: 'POST',
    uri: endpoint,
    formData: {
      file: {
        value: videoFile,
        options: {
          filename: videoName,
          contentType: 'video/mp4'
        }
      }
    },
    headers: {
      'content-type': 'multipart/form-data'
    }
  }

  try {
    const { thumbnailVideoId } = await rp.post(options)
    return {
      error: false,
      data: thumbnailVideoId
    }
  } catch (exception) {
    console.error(exception)
    return {
      error: true,
      data: exception
    }
  }
}

const queryProgress = async (videoId) => {
  const payload = await getAccessToken()
  const { error, data } = payload
  if (error) return payload

  const url = `https://api.videoindexer.ai/${LOCATION}/Accounts/${ACCOUNT_ID}/Videos/${videoId}/Index?accessToken=${data}`

  try {
    const { state } = await rp.get({
      uri: url,
      json: true
    })

    return {
      error: false,
      data: state
    }
  } catch (exception) {
    console.error(exception)
    return {
      error: true,
      data: exception
    }
  }
}

const getAnalysis = async (videoId) => {
  const payload = await getAccessToken()
  const { error, data } = payload
  if (error) return payload

  const endpoint = `https://api.videoindexer.ai/${LOCATION}/Accounts/${ACCOUNT_ID}/Videos/${videoId}/Index?accessToken=${data}`

  try {
    const { videos } = await rp.get({
      uri: endpoint,
      json: true
    })
    const [video] = videos.filter(({ id }) => id === videoId)

    const { insights } = video
    const { transcript, sentiments } = insights

    const transcriptInsights = await TextAnalytics.handleTranscript(transcript)

    return {
      error: false,
      data: {
        video: video,
        transcript: transcriptInsights.transcript
      }
    }
  } catch (exception) {
    console.error(exception)
    return {
      error: true,
      data: exception
    }
  }
}

module.exports = {
  postVideo: postVideo,
  queryProgress: queryProgress,
  getAnalysis: getAnalysis
}