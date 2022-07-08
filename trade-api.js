const leaguePath = "https://api.pathofexile.com/league";
const statsPath = "https://www.pathofexile.com/api/trade/data/stats";
const tradePath = "https://www.pathofexile.com/api/trade/search/Sentinel";

// Note: these don't work in browser because the trade api strictly enforces CORS

// Fetch leagues
// GET https://api.pathofexile.com/league (json response)
function getLeagues() {
    fetch(leaguePath)
	.then(response => {
		return response.json();
	})
	.then(jsondata => {
        // TODO
        console.log(jsondata);
	});
}

// Fetch item stats
// GET https://www.pathofexile.com/api/trade/data/stats (json response)
function getStats() {
    fetch(statsPath)
	.then(response => {
		return response.json();
	})
	.then(jsondata => {
        // TODO
        console.log(jsondata);
	});
}


// Search for item:
// POST https://www.pathofexile.com/api/trade/search/Sentinel
function testTradeApi() {
    let rqbody = '{"query":{"status":{"option":"onlineleague"},"stats":[{"type":"and","filters":[{"id":"explicit.stat_3258653591"}]}]},"sort":{"price":"asc"}}';
    fetch(tradePath, {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: rqbody
      }).then(res => {
        console.log(res);
      });
}