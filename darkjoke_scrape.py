from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
import json

all_jokes = []

def bestlifeonline(url):
    jokes = soup.find('ol')
    for joke in jokes.find_all('li'):
        all_jokes.append(joke.text.strip())

def thoughtcatalog(soup):
    container = soup.find('article')
    jokes = container.find('div', {'class': 'entry-block-group box-content'})
    
    questions = jokes.find_all('h2')
    answers = jokes.find_all('p')
    for joke in zip(questions, answers):
        q = joke[0].text.replace('\xa0', ' ')
        a = joke[1].text
        
        q = q.split('. ', 1)[1]

        all_jokes.append(f'{q}\n\n{a}')

def get_soup(url):
    request = Request(
        url,
        data=None,
        headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.360'
        }
    )
    
    with urlopen(request) as response:
        return BeautifulSoup(response, 'html.parser')

urls = {
    bestlifeonline: 'https://bestlifeonline.com/dark-jokes/',
    thoughtcatalog: 'https://thoughtcatalog.com/juliet-lanka/2018/03/50-messed-up-jokes-you-should-never-tell-your-easily-offended-friends/',
}

for func, url in urls.items():
    soup = get_soup(url)
    func(soup)
