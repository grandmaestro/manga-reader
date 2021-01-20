// Declaring custom directive to load comic publications from Manga
app.directive('comiclist', function () {
    return {
        restrict: 'E',
        templateUrl: 'customDirective/comiclist.html'
    };
});

// Declaring custom directive to load chapters from selected comic
app.directive('chapterbox', function () {
    return {
        restrict: 'E',
        templateUrl: 'customDirective/chapterbox.html'
    };
});

// Declaring custom directive to load the pages in a chapter in image roll.
app.directive('thumbnail', function () {
    return {
        restrict: 'E',
        templateUrl: 'customDirective/thumbnail.html'
    };
});