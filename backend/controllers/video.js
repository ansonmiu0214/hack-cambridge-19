const fs = require('fs')
const VideoIndexer = require('../services/VideoIndexer')
const Database = require('../services/database')

const SAMPLE_VIDEO_ID = "7770243107"


const postVideo = async (req, res, next) => {
  const videoName = 'sharen.mp4'
  const videoFile = fs.createReadStream(videoName)

  const { error, data } = await VideoIndexer.postVideo(videoName, videoFile)
  if (error) return res.status(400).send(data)

  res.send(data)
}

const queryProgress = async (req, res, next) => {
  const { error, data } = await VideoIndexer.queryProgress(SAMPLE_VIDEO_ID)
  if (error) return res.status(500).send(data)

  res.send(data)
}

const getAnalysis = async (req, res, next) => {
<<<<<<< HEAD
  //const SAMPLE_VIDEO_ID = "7770243107"
  const SAMPLE_VIDEO_ID = "56742031a6"

=======
>>>>>>> f8a3be61c80a4bcb82834ab0169e20f9d50c53a0
  const { error, data } = await VideoIndexer.getAnalysis(SAMPLE_VIDEO_ID)
  if (error) return res.status(500).send(data)

  res.send(data)
}

const getQuestion = async(req, res, next) => {
  const data =await Database.getInstance().getQuestion()
  console.log(data)
  res.send(data)
}

const getResponse  = async(req, res, next) => {
  const QUESTION_ID ="1"
  const data =await Database.getInstance().getResponse(QUESTION_ID)
  res.send(data)
}

module.exports = {
  postVideo: postVideo,
  queryProgress: queryProgress,
  getAnalysis: getAnalysis,
  getQuestion: getQuestion,
  getResponse: getResponse
}

// https://api.videoindexer.ai/{location}/Accounts/{accountId}/Videos?accessToken={accessToken}&name={name}[&description][&partition][&externalId][&callbackUrl][&metadata][&language][&videoUrl][&fileName][&indexingPreset][&streamingPreset][&linguisticModelId][&privacy][&externalUrl][&assetId][&priority][&personModelId][&brandsCategories]
