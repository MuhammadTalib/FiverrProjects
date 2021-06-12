let SuggestionServiceEndpoint: {[sudgestion: string] : string} = {
    "google":
    "//suggestqueries.google.com/complete/search?client=chrome&hl=${lang}&gl=${country}&callback=${callback}&q=",
    "google news":
    "//suggestqueries.google.com/complete/search?client=chrome&hl=${lang}&ds=n&gl=${country}&callback=${callback}&q=",
    "google shopping":
    "//suggestqueries.google.com/complete/search?client=chrome&hl=${lang}&ds=sh&gl=${country}&callback=${callback}&q=",
    "google books":
    "//suggestqueries.google.com/complete/search?client=chrome&hl=${lang}&ds=bo&gl=${country}&callback=${callback}&q=",
    "youtube":
    "//suggestqueries.google.com/complete/search?client=chrome&hl=${lang}&ds=yt&gl=${country}&callback=${callback}&q=",
    "google videos":
    "//suggestqueries.google.com/complete/search?client=chrome&hl=${lang}&ds=v&gl=${country}&callback=${callback}&q=",
    "google images":
    "//suggestqueries.google.com/complete/search?client=chrome&hl=${lang}&ds=i&gl=${country}&callback=${callback}&q=",
    "yahoo":
    "//search.yahoo.com/sugg/ff?output=jsonp&appid=ffd&callback=${callback}&command=",
    "bing": "//api.bing.com/osjson.aspx?JsonType=callback&Jsoncallback=${callback}&query=",
    "ebay":
    "//autosug.ebay.com/autosug?_jgr=1&sId=0&_ch=0&callback=${callback}&kwd=",
    "amazon":
    "//completion.amazon.co.uk/search/complete?method=completion&search-alias=aps&mkt=3&callback=${callback}&q=",
    "twitter":
    "//twitter.com/i/search/typeahead.json?count=30&result_type=topics&src=SEARCH_BOX&callback=${callback}&q=",
    "baidu": "//suggestion.baidu.com/su?cb=${country}&wd=",
    "yandex": "//yandex.com/suggest/suggest-ya.cgi?callback=${callback}&q=?&n=30&v=4&uil={lang}&part=",
    "google play": "//market.android.com/suggest/SuggRequest?json=1&c=0&hl=${lang}&gl=${country}&callback=${callback}&query=",
    "google play apps": "//market.android.com/suggest/SuggRequest?json=1&c=3&hl=${lang}&gl=${country}&callback=${callback}&query=",
    "google play movies": "//market.android.com/suggest/SuggRequest?json=1&c=4&hl=${lang}&gl=${country}&callback=${callback}&query=",
    "google play books": "//market.android.com/suggest/SuggRequest?json=1&c=1&hl=${lang}&gl=${country}&callback=${callback}&query=",
}
export default SuggestionServiceEndpoint;