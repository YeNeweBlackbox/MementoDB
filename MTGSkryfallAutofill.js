// 1. Initialize the HTTP client with mandatory Scryfall headers
var httpClient = http();
httpClient.headers({
    "User-Agent": "MementoMTGApp/1.0", // Required by Scryfall
    "Accept": "application/json"        // Required by Scryfall
});

// 2. Execute the search request
var url = "https://api.scryfall.com/cards/search?q=" + encodeURIComponent(query);
var response = httpClient.get(url);

// 3. Process the response based on the HTTP status code
if (response.code === 200) {
    // SUCCESS: Parse the card data
    var data = JSON.parse(response.body);
    var cards = data.data; 
    var resultArray = [];

    for (var i = 0; i < Math.min(cards.length, 10); i++) {
        var card = cards[i];
        resultArray.push({
            title: card.name,
            desc: card.type_line + " | " + (card.mana_cost || ""),
            id: card.id,
            
            // Properties for your library's field mapping:
            cardType: card.type_line,
            mana: card.mana_cost,
            setName: card.set_name,
            thumb: card.image_uris ? card.image_uris.small : "",
            largeImage: card.image_uris ? card.image_uris.normal : ""
        });
    }
    // Return the successful matches to the selection list
    result(resultArray);

} else {
    // FAILURE: Parse the Scryfall Error object (status 4XX or 5XX)
    try {
        var errorData = JSON.parse(response.body);
        
        // Check for the human-readable 'details' string provided by Scryfall
        if (errorData.details) {
            message("Scryfall Error: " + errorData.details); [3, 4]
        } else {
            message("Request failed with status code: " + response.code); [2, 4]
        }
    } catch (e) {
        // Fallback for non-JSON error responses
        message("An unexpected error occurred: " + response.code); [4]
    }

    // Return an empty array to clear the autofill list
    result([]); [5]
}
