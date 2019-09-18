# random-simpsons-episode

### Overview

[Random Simpsons Episode Live](http://www.davidanderson.nyc/random-simpsons-episode)

![screenshot](./assets/screenshot1.png)

Random Simpsons Episode takes a range of seasons for the TV show 'The Simpsons' and returns the title, airdate, and description of a randomly selected episode. 

![screenshot2](./assets/screenshot2.png)

### Technologies and Architecture

The Simpsons episode data was scraped from IMDB using the Python-built simpsons-scraper. The scraper wrote the episode data into a CSV file. Upon page load, an AJAX request is made to open the CSV file, and the episode data is formatted into JavaScript objects. When a random episode is generated, JQuery is used to update HTML elements. 

The necessary episode data is scraped by finding the relevent HTML elements based on their attributes; then the information is written to the CSV file under the corresponding headers: 

```python
def scrape_page( season_num ):
    # creates an array of HTML episode pages
    episode_num = 1
    for episode in episodes:
        title = encode_text(episode.find('a', attrs={'itemprop':'name'}))
        airdate = encode_text(episode.find('div', attrs={'class':'airdate'}))
        description = encode_text(episode.find('div', attrs={'class':"item_description"}))
        image_url = format_image_url(episode.find('img')['src'])
        season_episodes.append([season_num, episode_num, title, airdate, description, image_url])
        episode_num += 1
    # ...

def write_seasons( seasons ):
    file = open('simpsons_data.csv', 'wb')
    writer = csv.writer(file)

    writer.writerow(['Season', 'Episode', 'Title', 'Airdate', 'Description', 'Image'])
    for episodes in seasons:
        for episode in episodes:
            writer.writerow(episode)
    
    file.close()
```

Special characters are stripped out of the text to avoid confusion when being read in JavaScript: 

```python
def encode_text( txt ):
    text = txt.text.strip()
    if "," in text:
        text = '\comma'.join(text.split(","))
    if "\"" in text:
        text = ''.join(text.split('\"'))
    
    return text.encode('utf-8')
```

Once the document is loaded, the JavaScript file makes an AJAX request to read the data: 

```javascript
$(document).ready(() => {
    // ...
    $.ajax({
        url:"simpsons_data.csv",
        dataType:"text",
        success:function(data)
        {
            const episodeData = data.split(/\r?\n|\r/);
            episodeData.forEach((episode, i) => {
                // format episode and push into hashmap
            });
            // ... 
        }});
}); 
```

When the `button` with the id `on_load` is clicked, a random integer keys into the season hash to return an array of unique episode numbers. A second random integer returns one of the episode integers from that array, and that episode integer is keyed into a larger episode hash containing all of the episode information. Witht he random episode selected, `episodeHTML` is set with the relevant information and then added to the HTML:

```javascript
$('#load_episode').click(function(){
    // ...
    let randomInt = (Math.floor(Math.random() * (max - min + 1))) + min;
    let randomSeason = seasonHash[randomInt];
    let randomEpNum = randomSeason[Math.floor(Math.random() * randomSeason.length)];
    let randomEp = episodeHash[randomEpNum];

    let episodeHTML = `<div class="centered">
        <h3>${randomEp.Title}</h3>
        <h5>Season ${randomEp.Season} Episode ${randomEp.Episode}</h5>
        <img class="episode-screenshot" src=${randomEp.Image}></img>
        <p>${randomEp.Description}</p>
        <p>Original airdate: ${randomEp.Airdate}</p>
        </div>`;
    
    $('#episode-table').html(episodeHTML);
    });
```

### Artistic credits

'The Simpsons' was created by Matt Groening for the Fox Broadcasting Company. All Simpsons episode data was pulled from the [Internet Movie Database](https://www.imdb.com/). 'The Simpsons' logo is from [Wikipedia](https://commons.wikimedia.org/wiki/File:Logo_The_Simpsons.svg). Endless Donuts gif is from [Giphy](https://giphy.com/gifs/loop-the-simpsons-eating-3u1bKI2ve3G3S). Small donut from [PicsArt](https://picsart.com/i/sticker-dona-delicious-pink-simpsons-donuts-strawberry-yomi-291448903009211). Sky background from [Simpsons fan wiki](https://simpsons.fandom.com/f). [Rock Salt](https://fonts.google.com/specimen/Rock+Salt) font is from Google Fonts. 