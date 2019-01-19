/**
 * Processes the array of transcript objects .
 */
const handleTranscript = async (transcripts) => {

  const text = transcripts.map(ts => ts.text).join(' ')

  return {
    text: text
  }
}

module.exports = {
  handleTranscript: handleTranscript
}