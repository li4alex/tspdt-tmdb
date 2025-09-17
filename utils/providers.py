import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()
# tmdb_key = os.getenv("TMDB_KEY")
tmdb_key = os.environ["TMDB_KEY"]

movieProvidersUrlFront = "https://api.themoviedb.org/3/movie/"
tvProvidersUrlFront = "https://api.themoviedb.org/3/tv/"
providersUrlBack = "/watch/providers"
headers = {
  "accept": "application/json",
  "Authorization": tmdb_key
}

with open("./public/movie_data_with_ids.json", mode="r", encoding="utf-8") as read_file:
  tmdb_data = json.load(read_file)

for movieEntry in tmdb_data:
  movieId = movieEntry["TMDB ID"]
  if movieEntry["Media Type"] == "movie":
    providers = requests.get(movieProvidersUrlFront + str(movieId) + providersUrlBack, headers=headers)
  else:
    providers = requests.get(tvProvidersUrlFront + str(movieId) + providersUrlBack, headers=headers)
  movieEntry["Providers"] = providers.json()

with open("./public/table.json", "w", encoding="utf-8") as f:
  json.dump(tmdb_data, f, ensure_ascii=False, indent=2)