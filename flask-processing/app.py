from flask import Flask, render_template, request, jsonify
import re
import sys
import datetime, time
from collections import Counter
from math import log10, floor

app = Flask(__name__)
PORT=8080

def round_to_3sf(x):
    return round(x, -int(floor(log10(x))) + (3 - 1))

def process(data):
  '''
  TODO
  '''
  video = data['video']
  transcript = data['transcript']
  duration = data['duration']
  blocksNo = len(video['insights']['transcript'])
  sentiments = video['insights']['sentiments']

  #1. Number of pauses detected - blocks
  print ("Number of pauses detected:", blocksNo)

  darrenking = open("darren-king.txt", "r").read()
  onlyLettersRegex = re.compile('[^a-zA-Z\s]')
  darrenking = onlyLettersRegex.sub('', darrenking).lower()
  transcript = onlyLettersRegex.sub('', transcript).lower()
  #accuracyError = abs(len(transcript.split()) - len(darrenking.split()))

  correctTextAvailable = False
  if correctTextAvailable:
      firstMatching = {}
      secondMatching = {}
      for i in darrenking:
          firstMatching[i] = transcript.count(i)
      for j in transcript:
          secondMatching[j] = darrenking.count(j)

      accuracyError = abs(sum(firstMatching.values())-sum(secondMatching.values()))
      #2. Accuracy Error
      accuracyError = accuracyError / max(len(darrenking.split()),len(transcript.split()))
      print ("Accuracy Error: ", round_to_3sf(accuracyError)) #Clarity of words
  else:
      clarityScore = 0
      block = video['insights']['transcript']
      for l in range(0,blocksNo):
          clarityScore = clarityScore + (block[l]['confidence'] * len(onlyLettersRegex.sub('', block[l]['text']).split()))

      clarityScore = clarityScore/len(transcript.split()) * 100
      print ("Clarity Score: ", round_to_3sf(clarityScore))


  #3. Sentiment analysis
  sentimentScore = 0
  print (sentiments[0]['sentimentType'])
  for k in range(0,len(sentiments)):
      if sentiments[k]['sentimentType'] == 'Positive':
          sentimentScore = sentimentScore + 1
      elif sentiments[k]['sentimentType'] == 'Negative':
          sentimentScore = sentimentScore - 1

  print ("Sentiment Score: ", sentimentScore)
  if (sentimentScore <= 0):
      improvementOnSentiment = True
      print ("Sentiment requires improvements.")
  else:
      improvementOnSentiment = False
      print ("Good sentiment!")


  #4. Top three most used words
  ts = onlyLettersRegex.sub('', transcript).lower().split()

  mostUsedWords = Counter(ts).most_common(3)
  print("Most Used Words")
  print("1. ", mostUsedWords[0][0], "   ---   ", mostUsedWords[0][1], "times.")
  print("2. ", mostUsedWords[1][0], "   ---   ", mostUsedWords[1][1], "times.")
  print("3. ", mostUsedWords[2][0], "   ---   ", mostUsedWords[2][1], "times.")

  #5. Average Talking Speed
  speakTooSlow = False
  speakTooFast = True
  duration = time.strptime(duration.split('.')[0],'%H:%M:%S')
  durationInMinutes = datetime.timedelta(hours=duration.tm_hour,minutes=duration.tm_min,seconds=duration.tm_sec).total_seconds()/60
  averageSpeed = round_to_3sf(len(ts)/durationInMinutes)
  print ("Average Speed: ", averageSpeed, "words/minutes")
  if (averageSpeed < 140):
      speakTooSlow = True
  elif (averageSpeed > 170):
      speakTooFast = True

  #6. Pause length
  timeDelay = 0
  longDelay = False
  for k in range(0,blocksNo-1):
      endTime = time.strptime(video['insights']['transcript'][k]['instances'][0]['adjustedEnd'].split('.')[0],'%H:%M:%S')
      endTimeSec = datetime.timedelta(hours=endTime.tm_hour,minutes=endTime.tm_min,seconds=endTime.tm_sec).total_seconds()
      ms = video['insights']['transcript'][k]['instances'][0]['adjustedEnd'].split('.')[1]
      ms = (float(ms)/(10**len(ms)))
      endTimeSec = endTimeSec + ms

      startTime = time.strptime(video['insights']['transcript'][k+1]['instances'][0]['adjustedStart'].split('.')[0],'%H:%M:%S')
      startTimeSec = datetime.timedelta(hours=startTime.tm_hour,minutes=startTime.tm_min,seconds=startTime.tm_sec).total_seconds()
      ms = video['insights']['transcript'][k+1]['instances'][0]['adjustedStart'].split('.')[1]
      ms = (float(ms)/(10**len(ms)))
      startTimeSec = startTimeSec + ms

      timeDelay = round_to_3sf(timeDelay + (startTimeSec - endTimeSec))

  if (timeDelay > (1.3*(blocksNo-1))):
      longDelay = True

     
  return data




@app.route('/analysis', methods=['POST'])
def process_analysis():
  data = request.json
  processed_data = process(data)
  return jsonify(processed_data)


if __name__ == "__main__":
    app.run(debug=True, port=PORT)
