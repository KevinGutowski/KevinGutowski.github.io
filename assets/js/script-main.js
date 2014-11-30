$(document).ready(function() {
    $("#sidebar-button").click(function() {
        if ($("#sidebar-button").hasClass("button-active")) {
            $("body").removeClass("no-scroll");
            $("#sidebar-container").css("transform", "translateX(-280px)");
            $("#container").removeClass("container-active");
            $(".navBottom").removeClass("button-active");
            $("#sidebar-button").removeClass("button-active");
        } else {
            $("#sidebar-button").addClass("button-active");
            setTimeout(function() {
                $("#sidebar-container").css("transform", "translateX(0px)");
            }, 80);
            $("#container").addClass("container-active");
            $(".navBottom").addClass("button-active");
            setTimeout(function() {
                $("body").addClass("no-scroll");
            }, 300);
        }
    });
    
    $("#container").click(function() {
        if ($("#sidebar-button").hasClass("button-active")) {
            $("body").removeClass("no-scroll");
            $("#sidebar-container").css("transform", "translateX(-280px)");
            $("#container").removeClass("container-active");
            $(".navBottom").removeClass("button-active");
            $("#sidebar-button").removeClass("button-active");
        }
    });
    
    $("#books").click(function() {
        window.location = "books.html";
    });
});