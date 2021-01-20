/*
Project Name: Manga-Reader
Author: Vaibhav Gupta
mail: vaibhav1992.gupta@gmail.com , contact: +91-8143358614
Purpose: To list down all comics published by Manga and allow user to select chapters and read the comic.

Dependencies:   1. jquery-2.1.3.min.js
                2. angular.min.js
                3. manga.js
                4. customDirectives.js
                5. lazyload.js
     */



// Declare Manga angular module
var app = angular.module("Manga", []);
// Declaring constant API parameters for Mashape
app.constant("ConstAPIParam", {
    "xMashKey": "xMashKey",
    "comicUrl": "https://doodle-manga-scraper.p.mashape.com/mangastream.com/",
    "fetchComicUrl": "https://doodle-manga-scraper.p.mashape.com/mangastream.com/manga/{mangaid}/",
    "fetchChaptersUrl": "https://doodle-manga-scraper.p.mashape.com/mangastream.com/manga/{mangaid}/{chapterid}"
});

var controller = app.controller("Mangacontroller", ["$http", "$scope","$timeout","ConstAPIParam","mangaAPICaller", function ($http, $scope, $timeout,ConstAPIParam,mangaAPICaller) {
    $scope.init = function () {
        $scope.selectedComicId = "";
        $scope.comicList = {};
        $scope.chapterList = {};
        $scope.chapterPages = {};
        $scope.activeChapter = null;
        $scope.pageIndex = 0;
		$scope.showNoData= false;
		// API call to fetch and load all comic publications in an option list
		mangaAPICaller.comicListFetcher(function (data) {              // Syntax: mangaAPICaller.comicListFetcher(callback, fallback)
			$scope.comicList = data;
			$scope.showNoData= false;
		}, function () {
			$scope.showNoData= true;
		});
    };
    $scope.init();
    // Function to request Comic chapters on selecting publication from option list.
    $scope.requestComic = function () {
        var URL = ConstAPIParam.fetchComicUrl,
		successFn=function (data) {
            $scope.chapterList = data;
            $timeout(function () {
                $(".chapterBox div").on("click", function () {
                    $(".chapterBox div").removeClass("active");
                    $(this).addClass("active");
                });
            }, 2000);
            $scope.showNoData= false;
        },
		failFn= function () {
            $scope.showNoData= true;
        };
        URL = URL.replace("{mangaid}", $scope.selectedComicId);
        $scope.pageIndex = 0;
        mangaAPICaller.comicFetcher(URL, successFn, failFn);      
    }
    // Function to load the image rolls of comic chapter in the thumbnail view.
    $scope.loadChapters = function (chapterId) {
        $scope.activeChapter = chapterId;
        $scope.pageIndex = 0;
        var cloneContent = $scope.chapterPages[$scope.selectedComicId] ? $scope.chapterPages[$scope.selectedComicId][chapterId] : 0,
        chapterURL = ConstAPIParam.fetchChaptersUrl,       
		successFn= function (data) {
                $scope.chapterPages[$scope.selectedComicId] = {};
                if (data.pages && Object.keys(data.pages).length > 0) {
                    $scope.chapterPages[$scope.selectedComicId][chapterId] = data.pages;
                    $timeout(function () {
                        $("img.lazy").lazyload({                                          // Exploit Lazyload.js to load the images onlu when the images have reached the viewport.
                            effect: "fadeIn",
                            container: $("#thumbnailBox")
                        });
                    }, 500);
					
						$scope.showNoData= false;                   

                } else {
                    $scope.chapterPages[$scope.selectedComicId][chapterId] = {};
                    $scope.chapterPages[$scope.selectedComicId][chapterId][0] = { "url": "Images/Not_available_icon.jpg" };                   // Handling No chapter pages available scenario.
                }
                
            },
		 failFn=function () {
                $scope.showNoData= true;
            } ;
		 chapterURL = chapterURL.replace("{mangaid}", $scope.selectedComicId).replace("{chapterid}", chapterId);
        if (!cloneContent) {
			mangaAPICaller.comicFetcher(chapterURL, successFn, failFn);      
        }
    }
}]);