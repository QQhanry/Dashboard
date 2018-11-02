function PageTest() {
  MqttTEST();
  DataGet();
  DataPost();
}



function success(id) {
  document.getElementById(id).style.backgroundColor = "green";
  document.getElementById(id).innerHTML = "OK";
}
function failure(id){
  document.getElementById(id).style.backgroundColor = "red";
  document.getElementById(id).innerHTML = "KO";
}

function DataGet() {
  $.ajax({
    url : 'http://51.38.239.114/db6',
    type : 'GET', //type de requête HTTP
    dataType : 'json',
    success : function(data,status) {
      success("BDD2");
    },
    error : function(err) {
      failure("BDD2");
    }
  });
}

function DataPost() {
  //alert("POST");
  $.ajax({
    url : 'http://51.38.239.114/db6',
    headers : {
      "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGI2In0.N1HtGB128gBJ0ivOwwLJY2sZ7O6XU2RqcqsIIhPpxbI"
    },
    type : 'POST', //type de requête HTTP
    data : {
      sensor : "D10",
      timestamp : "2018-06-22T13:37:05Z",
      tcurrent : 12.00,
      tmin : 5.25,
      tmax : 15.75,
      tavg : 10.12,
      tstddev : 3.06,
      hcurrent : 56.00,
      havg : 76.15,
      hmax : 85.95,
      hmin : 55.62,
      hstddev : 3
    },
    success : function(response) {
      console.log("Status: success");
      success("BDD1");
    },
    error : function(err) {
      console.log("Status: error");
      console.log(arguments);
      failure("BDD1");
    }
  });
}

function MqttTEST() {
  $(document).ready(function () {
              ws = new WebSocket('ws://51.38.239.114:8080');

              ws.onmessage = function (evt) {
                  /*$('#msg').append('<p>' + evt.data + '</p>');*/
                  var obj;
                  obj = JSON.parse(evt.data);
                  success(obj.id);
                  success("broker2");
                  if (obj.id===undefined){failure("broker2");}
                  if (obj.date===undefined){failure("broker2");}
                  if (obj.temperature.current===undefined){failure("broker2");}
                  if (obj.temperature.min===undefined){failure("broker2");}
                  if (obj.temperature.max===undefined){failure("broker2");}
                  if (obj.temperature.avg===undefined){failure("broker2");}
                  if (obj.temperature.stddev===undefined){failure("broker2");}
                  if (obj.humidity.current===undefined){failure("broker2");}
                  if (obj.humidity.min===undefined){failure("broker2");}
                  if (obj.humidity.max===undefined){failure("broker2");}
                  if (obj.humidity.avg===undefined){failure("broker2");}
                  if (obj.humidity.stddev===undefined){failure("broker2");}
              };
              ws.onopen = function () {
                success("broker1");
              };
              ws.onclose = function () {
                failure("broker1");
              };
          });
}
