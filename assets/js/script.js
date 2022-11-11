$(document).ready(function () {
   /* Menu Toggle */

   $("a.mobile-menu").click(() => {
      $("body").toggleClass("menu-open");
   });

   /* Init Event Filter */
   initEventFilter();
});

var url = "https://636dfabbb567eed48acef73e.mockapi.io/api/v1/";
var locations = [];
var events = [];
var search = "";
var sizeStart = 50;
var sizeEnd = 250;
var sizeMax = 300;

function initEventFilter() {
   /* Get Initial Events */
   $.get(url + "locations", function (data) {
      locations = data;

      $("#event-locations").html("");

      locations.forEach((location) => {
         $("#event-location").append('<option value="' + location.id + '">' + location.city + ", " + location.state + "</option>");
      });

      $.get(url + "events?sortBy=date&order=desc", function (data) {
         events = data;
         addEvents();
      });
   });

   /* Slider */
   $("#form-range").slider({
      range: true,
      min: 0,
      max: sizeMax,
      values: [sizeStart, sizeEnd],
      slide: function (event, ui) {
         $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);

         sizeStart = ui.values[0];
         sizeEnd = ui.values[1];

         $("#form-range span:nth-child(2)").attr("data-content", ui.values[0]);
         $("#form-range span:nth-child(3)").attr("data-content", ui.values[1]);
      },
   });

   $("#form-range span:nth-child(2)").attr("data-content", sizeStart);
   $("#form-range span:nth-child(3)").attr("data-content", sizeEnd);

   /* Tabs */
   $(".events-filter .tabs .tab").click(function () {
      $(".events-filter .tabs .tab").removeClass("active");
      $(this).addClass("active");
   });
}

function addEvents() {
   var html = "";

   events.forEach((ev) => {
      var dt = new Date(ev.date);
      html += '<div class="col"><div class="detail"><div class="image">';
      html += '<img src="' + ev.image + "?rand=" + ev.id + ' alt="" />';
      html += '<div class="person"><i class="icon icon-user"></i> ';
      html += "Jane Doe " + ev.duration + " mins</div></div>";
      html += '<div class="info"><h3>' + ev.name + "</h3>";
      html += '<div class="date">' + getDate(ev.date) + " - " + locations[0].name + "</div>";
      html += "</div></div></div>";

      console.log(ev.location);
   });

   $(".events-lists").html(html);
}

function getDate(date) {
   var dt = new Date(date);
   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
   return monthNames[dt.getMonth()] + " " + dt.getDay() + ", " + dt.getFullYear();
}
