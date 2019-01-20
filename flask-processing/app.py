from flask import Flask, render_template, request, jsonify
import json
import re
import sys
import pandas as pd
import datetime, time
import nltk
from sklearn.linear_model import LinearRegression
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
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
  onlyLettersRegex = re.compile('[^a-zA-Z\s\']')
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

      clarityScore = round_to_3sf(clarityScore/len(transcript.split()) * 100)
      print ("Clarity Score: ", clarityScore)


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

   #7. Other interviewee also used the word ...
  stopWords = {'ourselves', 'hers', 'between', 'yourself', 'but', 'again', 'there', 'about', 'once', 'during', 'out', 'very', 'having', 'with', 'they', 'own', 'an', 'be', 'some', 'for', 'do', 'its', 'yours', 'such', 'into', 'of', 'most', 'itself', 'other', 'off', 'is', 's', 'am', 'or', 'who', 'as', 'from', 'him', 'each', 'the', 'themselves', 'until', 'below', 'are', 'we', 'these', 'your', 'his', 'through', 'don', 'nor', 'me', 'were', 'her', 'more', 'himself', 'this', 'down', 'should', 'our', 'their', 'while', 'above', 'both', 'up', 'to', 'ours', 'had', 'she', 'all', 'no', 'when', 'at', 'any', 'before', 'them', 'same', 'and', 'been', 'have', 'in', 'will', 'on', 'does', 'yourselves', 'then', 'that', 'because', 'what', 'over', 'why', 'so', 'can', 'did', 'not', 'now', 'under', 'he', 'you', 'herself', 'has', 'just', 'where', 'too', 'only', 'myself', 'which', 'those', 'i', 'after', 'few', 'whom', 't', 'being', 'if', 'theirs', 'my', 'against', 'a', 'by', 'doing', 'it', 'how', 'further', 'was', 'here', 'than'}
  text1 = open("train_data/56742031a6.json", "r").read()
  text2 = open("train_data/36174b019c.json", "r").read()
  text3 = open("train_data/be9cea6eed.json", "r").read()

  text1 = onlyLettersRegex.sub('', text1).lower().split()
  text1 = list(set(text1) - stopWords)
  text2 = onlyLettersRegex.sub('', text2).lower().split()
  text2 = list(set(text2) - stopWords)
  text3 = onlyLettersRegex.sub('', text3).lower().split()
  text3 = list(set(text3) - stopWords)
  transcript_list = list(set(transcript.lower().split()) - stopWords)

  exist_data_combined = (text1) + (text2) + (text3)
  counts = {}
  firstWord = ""
  secondWord = ""
  thirdWord = ""
  for t in exist_data_combined:
      if t in transcript_list:
          counts[t] = exist_data_combined.count(t)

  sorted_dict = sorted(counts, key=counts.get, reverse=True)

  if (len(sorted_dict) == 1):
      firstWord = sorted_dict[0]
  elif (len(sorted_dict) == 2):
      firstWord = sorted_dict[0]
      secondWord = sorted_dict[1]
  elif (len(sorted_dict) >= 3):
      firstWord = sorted_dict[0]
      secondWord = sorted_dict[1]
      thirdWord = sorted_dict[2]

  print (firstWord)
  print (secondWord)
  print (thirdWord)


  # LinearRegression
  df = pd.read_csv("train_data/dataset.csv", header=-1)
  lr = LinearRegression().fit(df[[1,2,3]],df[0])
  speed_pred = lr.predict([[clarityScore,sentimentScore,timeDelay]])
  print(lr.coef_)
  print ("Average Speed Prediction: ", speed_pred)
  speed_sqe = (speed_pred - averageSpeed)**2

  lr = LinearRegression().fit(df[[0,2,3]],df[1])
  clarity_pred = lr.predict([[averageSpeed,sentimentScore,timeDelay]])
  print(lr.coef_)
  print ("Clarity Score Prediction", clarity_pred)
  clarity_sqe = (clarity_pred - clarityScore)**2

  lr = LinearRegression().fit(df[[0,1,3]],df[2])
  sentiment_pred = lr.predict([[averageSpeed,clarityScore,timeDelay]])
  print(lr.coef_)
  print ("Sentiment Score Prediction", sentiment_pred)
  sentiment_sqe = (sentiment_pred - sentimentScore)**2

  lr = LinearRegression().fit(df[[0,1,2]],df[3])
  delay_pred = lr.predict([[averageSpeed,sentimentScore,clarityScore]])
  print(lr.coef_)
  print ("Delay Score Prediction", delay_pred)
  delay_sqe = (delay_pred - timeDelay)**2


  print ("Sum of squared errors:")
  print ("Average Speed:", speed_sqe)
  print ("Clarity Score:", clarity_sqe)
  print ("Sentiment Score:", sentiment_sqe)
  print ("Delay Score:", delay_sqe)
  clarityDecision = False
  sentimentDecision = False
  delayTimeDecision = False

  if (clarityScore < clarity_pred):
      clarityDecision = True

  if sentimentScore < sentiment_pred:
      sentimentDecision = True

  if timeDelay > delay_pred:
      delayTimeDecision = True



  data = {"clarity_score":clarityScore, #numeric
        "sentiment_score":sentimentScore, #numeric (can be -ve)
        "improvement_on_sentiment":improvementOnSentiment, #boolean#
        "average_speed":averageSpeed, #numeric
        "speak_too_slow":speakTooSlow, #boolean
        "speak_too_fast":speakTooFast, #boolean
        "time_delay": timeDelay, #numeric
        "long_delay":longDelay, #boolean
        "first_word":firstWord, #string - word that matches most with others
        "second_word":secondWord, #string - word that matches 2nd most with others
        "third_word": thirdWord, #tring - word that matches 3rd most with others
        #if True then "You should focus more on your speaking clarity.", else "Your clarity is good."
        "clarity_decision": clarityDecision,
        #if True then "You should show more enthusiasm.", else "Good interaction!"
        "sentiment_decision": sentimentDecision,
        #if True then "You should try to speak more.", else "Good time usage."
        "delay_time_decision": delayTimeDecision} #


  return data




@app.route('/analysis', methods=['POST'])
def process_analysis():
  data = request.json
  processed_data = process(data)
  return jsonify(processed_data)


if __name__ == "__main__":
    app.run(debug=True, port=PORT)
