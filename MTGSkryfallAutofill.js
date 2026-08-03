// 1. Query the Scryfall API for card names matching the input
var url = "https://api.scryfall.com/cards/search?q=name:" + encodeURIComponent(query);
var response = http().get(url);

// 2. Process the response if successful
if (response.code === 200) {
    var data = JSON.parse(response.body);
    var cards = data.data; // Scryfall returns cards in a 'data' array
    var resultArray = [];

    // 3. Format the first 10 matches for the selection list
    for (var i = 0; i < Math.min(cards.length, 10); i++) {
        var card = cards[i];
        resultArray.push({
            title: card.name,              // Required: Main text shown
            desc: card.type_line + " | " + (card.mana_cost || ""), // Subtitle
            id: card.id,                   // Unique ID
            
            // Properties for field mapping:
            cardType: card.type_line,
            mana: card.mana_cost,
            setName: card.set_name,
            // Use the 'small' image for the selection thumbnail
            thumb: card.image_uris ? card.image_uris.small : "",
            // Use the 'normal' image for your library's image field
            largeImage: card.image_uris ? card.image_uris.normal : ""
        });
    }

    // 4. Send results back to Memento
    result(resultArray);
}
