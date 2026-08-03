// 1. Fetch data using the Search URL from the GitHub JSON
var searchUrl = "https://openlibrary.org/search.json?q=" + encodeURIComponent(query) + "&limit=20";
var response = http().get(searchUrl);

if (response.code === 200) {
    var data = JSON.parse(response.body);
    var docs = data.docs; // This is the "Result Root" from the JSON
    var resultArray = [];

    // 2. Loop and format data using the "Field Mappings" from the JSON
    for (var i = 0; i < Math.min(docs.length, 15); i++) {
        var book = docs[i];
        resultArray.push({
            title: book.title, // 'Title' mapping
            desc: book.author_name ? book.author_name.join(", ") : "Unknown", // 'Author' mapping (with join)
            id: book.key, // 'ID' mapping
            
            // Custom properties for your field mapping:
            isbn: book.isbn ? book.isbn : "", 
            year: book.first_publish_year ? book.first_publish_year.toString() : "",
            thumb: book.cover_i ? "https://covers.openlibrary.org/b/id/" + book.cover_i + "-L.jpg" : "" // 'Cover' mapping
        });
    }

    // 3. Return results to Memento's Autofill selection list
    result(resultArray);
}