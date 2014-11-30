$(document).ready(function() {
    $(".book").click(function() {
        var mySelection = this
        if ($(":first-child", this).hasClass("other")) {
        } else {
            $(".book > div").removeClass("other");
            $(".book > .description").css("opacity","0");
            
            $(":first-child", this).addClass("other");
            $(".description", this).show();
            setTimeout(function() {
                $(".description", mySelection).css("opacity","1");
            },400);
        }
        if ($(this).hasClass("book-active")) {
        } else {
            $(".book").removeClass("book-active");
            $(".shelf").addClass("shelf-active");
            $(this).addClass("book-active");
            
        }
    });
    
    $("#backdrop").click(function() {
        if ($(".book > div").hasClass("other")) {
            $(".book > div").removeClass("other");
            $(".book > .description").css("opacity","0");
            $(".book").removeClass("book-active");
            $(".shelf").removeClass("shelf-active");
        } 
    });
    
    
});