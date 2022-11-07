// --------- Global variables & const. ---------

let cityName, coord, lat, lng
let byCoords = false; //boolean to print city name or coordinates
let urlString = "https://www.prevision-meteo.ch/services/json/bordeaux"; //default location
let popularCities = ["Paris", "Toulouse", "Lille", "Pessac", "Geneve"]; // List of all popular cities to display
let map;

// ------- Starting function when the page is created ----------
function init() {
    readJson();
    displayPopularCities();

    //Init eventListeners
    document.getElementById("day0").addEventListener("click", () => {
        changeToDay(0)});
    document.getElementById("day1").addEventListener("click", () => {
        changeToDay(1)});
    document.getElementById("day2").addEventListener("click", () => {
        changeToDay(2)});
    document.getElementById("day3").addEventListener("click", () => {
        changeToDay(3)});
    document.getElementById("add-city-btn").addEventListener("click", changeCityWithName);

    //leaflet map
    setUpMap();
}

// ------ Setup and prepare Leaflet Map -------->
function setUpMap(){
    map = L.map('map').setView([44.837789, -0.57918], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
map.on('click', function (e) {
    coord = e.latlng;
    lat = coord.lat;
    lng = coord.lng;
    changeCityWithCoords();
});
}

//--------- Get the right json from urlString variable to display it ----------
function readJson() {
    fetch(urlString).then(response => {
        return response.json();
    }).then(data => {
        displayCity(data);
    }).catch(err => {
    });
}

//------- Prepare a path for a new json (with a city name) --------
function changeCityWithName() {
    urlString = 'https://www.prevision-meteo.ch/services/json/' + document.getElementById("city-value").value;
    byCoords = false;
    readJson();
}

//------- Prepare a path for a new json (with coordinates) --------
function changeCityWithCoords() {
    urlString = 'https://www.prevision-meteo.ch/services/json/lat=' + lat + 'lng=' + lng;
    byCoords = true;
    readJson();
    window.location.assign("main.html#begin");
}

// -------- Print all datas on the page ------------
function displayCity(data) {
    //if location is with coordinates
    if (byCoords) {
        document.getElementById("city-name").innerHTML = "Lattitude: " + lat.toFixed(3);
        document.getElementById("country-name").innerHTML = "<br>Longitude: " + lng.toFixed(3);
    }
    //or if location is using a city name as location
    else {
        document.getElementById("city-name").innerHTML = data.city_info.name;
        document.getElementById("country-name").innerHTML = data.city_info.country;
    }

    //---- General infos. -----
    document.getElementById("current-hour").innerHTML = data.current_condition.hour;
    document.getElementById("current-cond-img").src = data.current_condition.icon_big;
    document.getElementById("current-cond").innerHTML = data.current_condition.condition;
    document.getElementById("current-temp").innerHTML = data.current_condition.tmp+ "  °C";
    document.getElementById("current-pressure").innerHTML = data.current_condition.pressure + " hPa";
    document.getElementById("current-humidity").innerHTML = data.current_condition.humidity + " %";
    document.getElementById("current-wind").innerHTML = data.current_condition.wnd_spd + " km/h";
    document.getElementById("sunrise").innerHTML = data.city_info.sunrise ;
    document.getElementById("sunset").innerHTML = data.city_info.sunset ;
    document.getElementById("latitude").innerHTML = data.city_info.latitude ;
    document.getElementById("longitude").innerHTML = data.city_info.longitude ;

    //---- Details by Days. -----
    document.getElementById("day0-date").innerHTML = data.fcst_day_0.date;
    document.getElementById("day0-tmin").innerHTML = data.fcst_day_0.tmin;
    document.getElementById("day0-tmax").innerHTML = data.fcst_day_0.tmax;
    document.getElementById("day0-img").src = data.fcst_day_0.icon_big;
    document.getElementById("day0-cond").innerHTML = data.fcst_day_0.condition;

    document.getElementById("day1-day").innerHTML = data.fcst_day_1.day_long;
    document.getElementById("day1-date").innerHTML = data.fcst_day_1.date;
    document.getElementById("day1-tmin").innerHTML = data.fcst_day_1.tmin;
    document.getElementById("day1-tmax").innerHTML = data.fcst_day_1.tmax;
    document.getElementById("day1-img").src = data.fcst_day_1.icon_big;
    document.getElementById("day1-cond").innerHTML = data.fcst_day_1.condition;

    document.getElementById("day2-day").innerHTML = data.fcst_day_2.day_long;
    document.getElementById("day2-date").innerHTML = data.fcst_day_2.date;
    document.getElementById("day2-tmin").innerHTML = data.fcst_day_2.tmin;
    document.getElementById("day2-tmax").innerHTML = data.fcst_day_2.tmax;
    document.getElementById("day2-img").src = data.fcst_day_2.icon_big;
    document.getElementById("day2-cond").innerHTML = data.fcst_day_2.condition;

    document.getElementById("day3-day").innerHTML = data.fcst_day_3.day_long;
    document.getElementById("day3-date").innerHTML = data.fcst_day_3.date;
    document.getElementById("day3-tmin").innerHTML = data.fcst_day_3.tmin;
    document.getElementById("day3-tmax").innerHTML = data.fcst_day_3.tmax;
    document.getElementById("day3-img").src = data.fcst_day_3.icon_big;
    document.getElementById("day3-cond").innerHTML = data.fcst_day_3.condition;

    //---- Details by Days. -----
    generateDatasForHours(data);

    //----- Days Switcher
    document.getElementById("day1").innerHTML = data.fcst_day_1.day_long;
    document.getElementById("day2").innerHTML = data.fcst_day_2.day_long;
    document.getElementById("day3").innerHTML = data.fcst_day_3.day_long;

}

// -------- Print only datas about hours details (called from displayCity) -------------- 
function generateDatasForHours(data) {
    let d = [];
    d.push(data.fcst_day_0);
    d.push(data.fcst_day_1);
    d.push(data.fcst_day_2);
    d.push(data.fcst_day_3);
    for (let day = 0; day < 4; day++) {
        document.getElementById("hours-details-day" + day).innerHTML = "";
        for (hour in d[day].hourly_data) {
            let div = document.createElement("div");
            div.classList.add("item");

            let col1 = document.createElement("div");
            col1.classList.add("column");
            let col2 = document.createElement("div");
            col2.classList.add("column");
            let col3 = document.createElement("div");
            col3.classList.add("column");

            let img = document.createElement("img");
            img.src = d[day].hourly_data[hour].ICON;

            let h5 = document.createElement("h5");
            h5.innerHTML = hour;
            let p1 = document.createElement("p");
            p1.innerHTML = d[day].hourly_data[hour].CONDITION;

            let p2 = document.createElement("p");
            let i1 = document.createElement("i");
            i1.classList.add("fa");
            i1.classList.add("fa-temperature-quarter");
            p2.append(i1);
            p2.innerHTML += '  ' + d[day].hourly_data[hour].TMP2m + ' °C';
            let p3 = document.createElement("p");
            let i2 = document.createElement("i");
            i2.classList.add("fa");
            i2.classList.add("fa-droplet");
            p3.append(i2);
            p3.innerHTML += '  ' + d[day].hourly_data[hour].RH2m + ' %';

            col1.append(img);
            col2.append(h5);
            col2.append(p1);
            col3.append(p2);
            col3.append(p3);
            div.append(col1);
            div.append(col2);
            div.append(col3);
            document.getElementById("hours-details-day" + day).append(div);
        }
    }
}

// ------- Go to a pre selectionned city (popular cities) -----
function changeToCity(nb){
    urlString = 'https://www.prevision-meteo.ch/services/json/'+popularCities[nb];
    byCoords = false;
    readJson();
    window.location.assign("main.html#begin");
}

//------ Display popular cities on the page ------
function displayPopularCities(){    
    for (let nb = 0; nb < 5; nb++){
        fetch("https://www.prevision-meteo.ch/services/json/"+popularCities[nb]).then(response => {
            return response.json();
        }).then(data => {
            let li = document.createElement("li");
            let img = document.createElement("img");
            img.src = data.current_condition.icon_big;
            let i = document.createElement("i");
            i.classList.add("fa");
            i.classList.add("fa-location-dot");
            let h4 = document.createElement("h4");
            h4.append(i);
            h4.innerHTML += data.city_info.name;
            let span = document.createElement("span");
            span.innerHTML = data.current_condition.tmp+" °C";
            let div = document.createElement("div");
            div.classList.add("main-button");
            let a = document.createElement("a");
            a.innerHTML = "Voir";
            a.addEventListener("click",()=>{
                changeToCity(nb);
            });
            div.append(a);
            li.append(img);
            li.append(h4);
            li.append(span);
            li.append(div);
            document.getElementById("popular-cities-list").append(li);
        }).catch(err => {
        });
    }
}


// ---- Hide useless sections and display the right one -------
function changeToDay(nb){
    for (let i = 0; i<4; i++){
        if (i==nb){
            document.getElementById("hours-details-day"+i).classList.remove("hidden");
            document.getElementById("day"+i).classList.add("active");
        }
        else{
            document.getElementById("hours-details-day"+i).classList.add("hidden");
            document.getElementById("day"+i).classList.remove("active");
        }
    }
}

init();