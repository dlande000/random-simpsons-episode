$(document).ready(() => {
    let seasonHash = {};
    let episodeHash = {};
    let episodeNum = 1;
    let headers;

    $.ajax({
        url:"simpsons_data.csv",
        dataType:"text",
        success:function(data)
        {
            const episodeData = data.split(/\r?\n|\r/);
            episodeData.forEach((episode, i) => {
            let episodeArr;

            if (i === 0) {
                headers = episode.split(",");
            } else {
                episodeArr = episode.split(",");
                if (!(seasonHash.hasOwnProperty(episodeArr[0]))) {
                    seasonHash[episodeArr[0]] = [episodeNum];
                } else {
                    seasonHash[episodeArr[0]].push(episodeNum);
                }
                let episodeObj = {};
                for (let j = 0; j < headers.length; j++) {
                    if (episodeArr[j].includes("\\comma")) {
                        episodeArr[j] = episodeArr[j].split("\\comma").join(",");
                    }
                    episodeObj[headers[j]] = episodeArr[j];
                }
                episodeHash[episodeNum] = episodeObj;
                episodeNum++;
            }
            });

            let inputSeasons = (position) => {
                let seasonInput = ['<select name="seasons">'];
                for (let seasonNum = 1; seasonNum < 31; seasonNum++) {
                    let toPush;
                    if ((position === "position1" && seasonNum === 1) || (position === "position2" && seasonNum === 10)) {
                        toPush = "<option selected value=" + seasonNum + ">" + seasonNum + "</option>";
                    } else {
                        toPush = "<option value=" + seasonNum + ">" + seasonNum + "</option>";
                    }
                    seasonInput.push(toPush);
                }
                seasonInput.push('</select>');
                return seasonInput.join('');
            };

            $('#lower_seasons').html(inputSeasons("position1"));
            $('#upper_seasons').html(inputSeasons("position2"));

            $('#load_episode').click(function(){
                let firstSeason = Number($('#lower_seasons option:selected').text());
                let secondSeason = Number($('#upper_seasons option:selected').text());
                let min;
                let max;

                if (firstSeason <= secondSeason) {
                    min = firstSeason;
                    max = secondSeason;
                } else {
                    min = secondSeason;
                    max = firstSeason;
                }

                let randomInt = (Math.floor(Math.random() * (max - min + 1))) + min;
                let randomSeason = seasonHash[randomInt];
                let randomEpNum = randomSeason[Math.floor(Math.random() * randomSeason.length)];
                let randomEp = episodeHash[randomEpNum];

                let episodeHTML = `<div>
                    <h3>${randomEp.Title}</h3>
                    <h5>Season ${randomEp.Season} Episode ${randomEp.Episode}</h5>
                    <img src=${randomEp.Image}></img>
                    <p>${randomEp.Description}</p>
                    <p>Original airdate: ${randomEp.Airdate}</p>
                    </div>`;
                
                $('#episode-table').html(episodeHTML);
                });
            }
    }); 
});