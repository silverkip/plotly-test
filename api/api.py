import time
from datetime import date, timedelta
from flask import Flask, Response, request, jsonify
import json
from textblob import TextBlob
import pandas as pd
import re
import tweepy
import os
from dotenv import load_dotenv
from flask_cors import CORS
load_dotenv()

app = Flask(__name__)
CORS(app)

N_TWEET = 100

api_key = os.getenv('API_KEY')
api_key_secret = os.getenv('API_KEY_SECRET')

access_token = os.getenv('ACCESS_TOKEN')
access_token_secret = os.getenv('ACCESS_TOKEN_SECRET')

# authentication
auth = tweepy.OAuthHandler(api_key, api_key_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

def clean_text(text):  
  pat1 = r'@[^ ]+'                   
  pat2 = r'https?://[A-Za-z0-9./]+'  
  pat3 = r'\'s'                      
  pat4 = r'\#\w+'                     
  pat5 = r'&amp'                 
  pat6 = r'[^A-Za-z\s]'               
  combined_pat = r'|'.join((pat1, pat2,pat3,pat4,pat5, pat6))
  text = re.sub(combined_pat,"",text).lower()
  return text.strip()

def fetch_tweets(query):
  print(query)
  tweet_container = []
  tweets = api.search_tweets(q=query, result_type='mixed', count=100, tweet_mode="extended") # https://docs.tweepy.org/en/stable/extended_tweets.html
  for tweet in tweets:
    tweet = tweet._json
    blob = TextBlob(clean_text(tweet['full_text']))
    tweet_url = 'https://twitter.com/i/web/status/' + tweet['id_str']
    tweet_container.append([
      tweet['user']['screen_name'],
      tweet['user']['name'],
      tweet_url,
      tweet['created_at'],
      tweet['full_text'],
      tweet['favorite_count'],
      tweet['retweet_count'],
      tweet['user']['followers_count'],
      tweet['user']['statuses_count'],
      tweet['user']['profile_image_url_https'],
      blob.sentiment.polarity,
      blob.sentiment.subjectivity,
      tweet['user']
    ])
# Creating a dataframe to load the list
  df = pd.DataFrame(tweet_container, columns=[
    "User",
    "DisplayName",
    "URL",
    "Date Created",
    "Tweet",
    "Likes",
    "Retweets",
    "Followers",
    "Statuses",
    "ProfileURL",
    "Polarity",
    "Subjectivity",
    "User Info"
  ])
  return Response(df.to_json(orient="records"))


@app.route('/search', methods=['POST'])
def search():
  query = json.loads(request.data.decode(encoding="ascii"))
  data = fetch_tweets(query)
  return data


if __name__ == "__main__":
    app.run(host='0.0.0.0')