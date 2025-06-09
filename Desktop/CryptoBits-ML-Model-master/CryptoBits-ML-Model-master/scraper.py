import requests
from bs4 import BeautifulSoup

baseUrl = "https://cryptonews.com/"

url = "https://cryptonews.com/news/cryptonews-deals"

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36", "Content-Type": "application/json"}

def newsScraper():
    newsData = []

    r = requests.get(url, headers=headers)
    newsLinksSoup = BeautifulSoup(r.content, 'html.parser')
    prettyNews = newsLinksSoup.prettify()
    newsArticles = newsLinksSoup.find_all("a", {"class": "article__title"})

    for i in newsArticles:
        newsContent = requests.get(baseUrl+i["href"], headers=headers)
        newsContentSoup = BeautifulSoup(newsContent.content, 'html.parser')
        prettyContent = newsContentSoup.prettify()
        newsImages = newsContentSoup.find_all("img", {"class": "content-img"})
        newsHeading = newsContentSoup.find_all("h1")
        newsContentText = newsContentSoup.find_all("p")

        newsContentTextList = []

        for j in newsContentText:
            newsContentTextList.append(j.text)

        newsData.append([str("https://cryptonews.com"+i['href']), str(newsImages[0]["src"]) if len(newsImages)!=0 else None, str(newsHeading[0].text), newsContentTextList])
        print(newsData)
        break

    return newsData

# newsScraper()