$(window).on("load", function(){

    var geok = "91eb7c81e4675bcb";        
    var location = {};
    var weatherData = {};
    var retrieving = true;

    $("#temp").click(function(){
    
        if(!retrieving)
        {
            $(this).children("p").eq(0).fadeOut(function(){
                var temperature = $(this).text() === weatherData.temps.F ? weatherData.temps.C : weatherData.temps.F;
                $(this).html(temperature).fadeIn();
            });
        }
    });

    $("#refresh-btn").click(function(){
        
        if(!retrieving)
        {
            retrieving = true;
            retrieveData();
        }
    });

    function retrieveData()
    {
        $("#head-cont > h2:nth-child(2)").animate({opacity:0});
        var tornClone = $(".tornado").clone(true);
        $(".data-box").html(tornClone);

        $(".tornado").each(function(idx){
            if(idx < $(".tornado").length - 1)
            {
                $(this).children(".bar").eq(0).addClass("twist");            
                $(this).children(".bar").eq(1).addClass("twist-reverse");
                $(this).children(".bar").eq(2).addClass("twist");            
                $(this).children(".bar").eq(3).addClass("twist-reverse");
            }               
        });

        altGetLatLong();         
    }

    function altGetLatLong() {

        $.get("https://ipinfo.io/", function(response) {
            var latLong = response.loc;
            reverseGeoCode(latLong);
        }, "jsonp");           
    }

    function reverseGeoCode(latlong){

         var queryLocation = "https://api.wunderground.com/api/"+geok+"/geolookup/q/"+latlong+".jsonp";
         $.get(queryLocation, function(data){
            location.country = data.location.country_iso3166;
            location.city = data.location.city;
            getWeather(location);
        });
    }

    function getWeather(location)
    {
        var queryCond = "https://api.wunderground.com/api/"+geok+"/conditions/q/"+location.country+"/"+location.city+".json";

        $.get(queryCond, function(data){                
            weatherData.condition = data.current_observation.weather;
            weatherData.temps = {
                                 F : data.current_observation.temp_f + " F",
                                 C : data.current_observation.temp_c + " C"
                                }
            weatherData.pic = data.current_observation.icon_url.toString();

            setTimeout(fillDataFields, 1500);
        });          
    }

    function fillDataFields()
    {            
        $("#head-cont > h2:nth-child(2)").html(location.city + ", " + location.country).animate({opacity:1});
        $("#icon").html("<img src='" + weatherData.pic + "' />");
        $("#weather").html("<p>" + weatherData.condition + "</p>");
        $("#temp").html("<p>" + weatherData.temps.F + "<br /></p><p style='margin-top:-10px;'><i class='fa fa-refresh'></i></p>");

        retrieving = false;
    }

    retrieveData();

});
