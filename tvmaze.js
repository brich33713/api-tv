/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	//http://api.tvmaze.com/search/shows?q=<search query>
	let x = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
	return [
		{
			id: x.data[0].show.id,
			name: x.data[0].show.name,
			summary: x.data[0].show.summary,
			image: x.data[0].show.image.medium ? x.data[0].show.image.medium : 'http://tinyurl.com/missing-tv'
		}
	];
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $('#shows-list');
  
	$showsList.empty();
  
	for (let show of shows) {
		let $item = $(
			`<div class="Show row col-6" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}"> 
          <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
         </div>
       </div>
      `
		);

		$showsList.prepend($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

  let shows = await searchShows(query);
	populateShows(shows);
  let episodes = await getEpisodes(shows[0].id);
  populateEpisodes(episodes)

  $('#expand').show()
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	let y = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

	let episodeArray = [];
	for (let episode of y.data) {
		episodeArray.push({
			id: episode.id,
			name: episode.name,
			season: episode.season,
			number: episode.number
		});
	}
	return episodeArray;
}

//Takes in an array of objects and loops over each object to pull out data
function populateEpisodes(episodes) {
  console.log(episodes)
  for (let episode of episodes) {
    $('#episodes-list').append(`<li> ${episode.name} (season: ${episode.season}, number: ${episode.number})`)
	}
}

//Reveals episode area
$('#expand').on('click', async function expandButton(e) {
  e.preventDefault();
  console.log('test')
  $('#episodes-area').show();
});

//Uncomment this code to test out api information before implementing into code
// async function testApi() {
// 	let y = await axios.get('http://api.tvmaze.com/seasons/1/episodes');
// 	console.log(y.data);
// }

// testApi();
