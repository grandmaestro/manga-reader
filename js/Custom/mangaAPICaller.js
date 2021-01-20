// Declaring custom Service 
app.factory('mangaAPICaller', function ($http, ConstAPIParam) {
    var header = { "X-Mashape-Authorization": ConstAPIParam.xMashKey };
    return {
        comicListFetcher: function (callback, fallback) {
            $http.get(ConstAPIParam.comicUrl, {
                headers: header
            }).success(callback).error(fallback);
        },
        comicFetcher: function (sURL, callback, fallback) {
            $http.get(sURL, {
                headers: header
            }).success(callback).error(fallback);
        }
    }
});