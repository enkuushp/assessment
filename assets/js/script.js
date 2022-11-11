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
var isFuture = true;
var locationId = 0;
var eventDuration = "";
var priceMin = 0;
var priceMax = 200;

function initEventFilter() {
  /* Get Initial Events */
  $.get(url + "locations", function (data) {
    locations = data;

    $("#event-location").html('<option value="0">Select Location</option>');

    locations.forEach((location) => {
      $("#event-location").append(
        '<option value="' +
          location.id +
          '">' +
          location.city +
          ", " +
          location.state +
          "</option>"
      );
    });

    $.get(url + "events?sortBy=date&order=desc", function (data) {
      events = data;
      filterEvents();
    });
  });

  /* Event Search */
  $("#event-search").keyup(function (e) {
    e.preventDefault();
    search = $(this).val();

    filterEvents();
  });

  /* Tabs */
  $(".events-filter .tabs .tab").click(function () {
    $(".events-filter .tabs .tab").removeClass("active");
    $(this).addClass("active");
    isFuture = $(this).attr("data-value") == "past" ? false : true;

    filterEvents();
  });

  /* Location */
  $("#event-location").change(function (e) {
    e.preventDefault();
    locationId = $(this).val();

    filterEvents();
  });

  /* Duration */
  $("#event-duration").change(function (e) {
    e.preventDefault();
    eventDuration = $(this).val();

    filterEvents();
  });

  /* Price Min Max */
  $("#price-min").keyup(function (e) {
    e.preventDefault();
    priceMin = $(this).val().toString().replace(/\D/g, "");

    if ($(this).val().toString().length != $(this).val().toString().length) {
      $(this).val(priceMin);
    }

    filterEvents();
  });

  $("#price-max").keyup(function (e) {
    e.preventDefault();
    priceMax = $(this).val().toString().replace(/\D/g, "");

    if ($(this).val().toString().length != $(this).val().toString().length) {
      $(this).val(priceMax);
    }

    filterEvents();
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

      filterEvents();
    },
  });

  $("#form-range span:nth-child(2)").attr("data-content", sizeStart);
  $("#form-range span:nth-child(3)").attr("data-content", sizeEnd);
}

function filterEvents(load = false) {
  var html = "";
  var filtered_events = [];
  var today = new Date();

  filtered_events = events.filter((evnt) => {
    let evDate = new Date(evnt.date);
    let ret = true;

    /* By Search */
    if (search != "" && evnt.name.indexOf(search) == -1) {
      ret = false;
    }

    /* By Date */
    if (isFuture && evDate < today) {
      ret = false;
    } else if (!isFuture && evDate > today) {
      ret = false;
    }

    /* By Location */
    if (locationId > 0 && evnt.locationId != locationId) {
      ret = false;
    }

    /* By Duration */
    if (eventDuration != "" && evnt.duration != eventDuration) {
      ret = false;
    }

    /* By Price */
    if (priceMin > evnt.price || priceMax < evnt.price) {
      ret = false;
    }

    /* By Size */
    if (sizeStart > evnt.seats || sizeEnd < evnt.seats) {
      ret = false;
    }

    return ret;
  });

  var eventNum = filtered_events.length;
  var more = "";

  if (!load && eventNum > 6) {
    filtered_events = filtered_events.slice(0, 6);
    more = '<div class="more"><a id="load_more" onClick="loadMore();">Load More (' + eventNum +')</a></div>';
  }

  filtered_events.forEach((ev) => {
    html += '<div class="col"><div class="detail"><div class="image">';
    html += '<img src="' + ev.image + "?rand=" + ev.id + ' alt="" />';
    html += '<div class="person"><i class="icon icon-user"></i> ';
    html += "Jane Doe " + ev.duration + " mins</div></div>";
    html += '<div class="info"><h3>' + ev.name + "</h3>";
    html +=
      '<div class="date">' +
      getDate(ev.date) +
      " - " +
      locations[ev.locationId - 1].name +
      ", " +
      locations[ev.locationId - 1].city +
      ", " +
      locations[ev.locationId - 1].state +
      "</div>";
    html +=
      '<div class="price"><strong>Price:</strong> $' +
      ev.price.toFixed(2) +
      "</div>";
    html += "</div></div></div>";
  });

  html += more;

  $(".events-lists").html(html);
}

function loadMore() {
  filterEvents(true);
}

function getDate(date) {
  var dt = new Date(date);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    monthNames[dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear()
  );
}
