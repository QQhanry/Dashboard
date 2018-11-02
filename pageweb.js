var Active = 0;


function LoadPage() {


  $("#I2").hide();
  $("#I3").hide();
  $("#I4").hide();
  $("#I5").hide();
  $("#I6").hide();
  $("#I7").hide();
  $("#I8").hide();
  Active = 1;
  /*console.log("Active: " + Active);*/

  MqttBroker();

}

function SlideDiv(div) { //affichage d'une seule page à la fois

  if (div != Active) {
    $("#I" + Active).fadeToggle(900);
    $("#I" + div).fadeToggle(900);
    Active = div;
    /*console.log("Active: " + Active);*/
  }

}

function Clickslide(div1) { //affichage dans la page
  $("." + div1).slideToggle(900);
  $("#" + div1).slideToggle(900);

}

function pop_up() {
  window.open("Fonctionnalités.html", "Page de test", "resizable");
}


function ChangeFormat(sensor, input) {
  var output = {};
  var timevalue;

  if (input.sensor == sensor) {
    //console.log("OUI");
    var tmp1 = input.timestamp.slice(11, 19);
    var tmp2 = tmp1.slice(6, 8);
    tmp2 = Number(tmp2);
    if (tmp2 < 30) {
      var tmp3 = tmp1.slice(0, 5);
      tmp1 = input.timestamp.slice(8, 10);
      tmp3 = tmp1 + " " + tmp3;
      tmp1 = input.timestamp.slice(5, 7);
      tmp3 = tmp1 + "-" + tmp3;
      tmp1 = input.timestamp.slice(0, 4);
      tmp3 = tmp1 + "-" + tmp3;
      tmp1 = input.timestamp.slice(17, 19);
      tmp3 = tmp3 + ":" + tmp1;
      output.time = tmp3;
    } else {
      var tmp3 = tmp1.slice(3, 5);
      tmp3 = Number(tmp3);
      tmp3++;
      tmp3 = tmp3.toString();
      var tmp4 = tmp1.slice(0, 3);
      var tmp5 = tmp4 + tmp3;
      tmp1 = input.timestamp.slice(8, 10);
      tmp5 = tmp1 + " " + tmp5;
      tmp1 = input.timestamp.slice(5, 7);
      tmp5 = tmp1 + "-" + tmp5;
      tmp1 = input.timestamp.slice(0, 4);
      tmp5 = tmp1 + "-" + tmp5;
      tmp1 = input.timestamp.slice(17, 19);
      tmp5 = tmp5 + ":" + tmp1;
      output.time = tmp5;
    }
    output.tcurrent = input.tcurrent;
    output.tmax = input.tmax;
    output.tmin = input.tmin;
    output.hcurrent = input.hcurrent;
    output.hmax = input.hmax;
    output.hmin = input.hmin;

    tmp1 = output.time.slice(0, 4);
    tmp1 = Number(tmp1);
    timevalue = 31556952 * tmp1;

    tmp1 = output.time.slice(5, 7);
    tmp1 = Number(tmp1);
    tmp1 = 2629746 * tmp1;
    timevalue = timevalue + tmp1;


    tmp1 = output.time.slice(8, 10);
    tmp1 = Number(tmp1);
    tmp1 = 86400 * tmp1;
    timevalue = timevalue + tmp1;


    tmp1 = output.time.slice(11, 13);
    tmp1 = Number(tmp1);
    tmp1 = 3600 * tmp1;
    timevalue = timevalue + tmp1;


    tmp1 = output.time.slice(14, 16);
    tmp1 = Number(tmp1);
    tmp1 = 60 * tmp1;
    timevalue = timevalue + tmp1;


    tmp1 = output.time.slice(17, 19);
    tmp1 = Number(tmp1);
    tmp1 = tmp1;
    timevalue = timevalue + tmp1;
    console.log("timevalue " + sensor + " " + timevalue);

    output.timevalue = timevalue;

    //console.log(output);

    return output;
  } else {
    //console.log("NON");
    output.empty = true;
    return output;
  }
}


function Historique(sensor) {
  $.ajax({
    url: 'http://51.38.239.114/db6',
    type: 'GET', //type de requête HTTP
    dataType: 'json',
    success: function(data, status) {
      /*console.log("Status:" + status);
      console.log(data);
      console.log(data.length);*/

      var i;
      var j = 0;
      var obj = {};
      var tab = [];
      for (i = 0; i < data.length; i++) {
        obj = ChangeFormat(sensor, data[i]);
        if (obj.empty != true) {
          tab[j] = {};
          tab[j].column1 = obj.tcurrent;
          tab[j].column2 = obj.tmin;
          tab[j].column3 = obj.tmax;
          tab[j].date = obj.time;
          //console.log("timevalue " + obj.timevalue);
          tab[j].timevalue = obj.timevalue;
          j++;
        }
      }

      /*Tri bulles*/
      for (i = 0; i < tab.length; i++) {
        for (j = 1; j < tab.length; j++) {
          if (tab[j - 1].timevalue > tab[j].timevalue) {
            obj = tab[j - 1];
            tab[j - 1] = tab[j];
            tab[j] = obj;
          }
        }
      }
      console.log(tab);

      /*Création du graphique*/
      var id = sensor.slice(1,2);
      id = "chartdiv" + id;
      console.log("divid " + id);
      graph(tab,id);


    },
    error: function(err) {
      alert("Status:" + err.responseText + "\nERROR");
    }
  });
}



function graph(tab,id) {
  var i = 0;

  var chartConfig = {
    "type": "serial",
    "categoryField": "date",
    "dataDateFormat": "YYYY-MM-DD HH:NN:SS",
    "categoryAxis": {
      "minPeriod": "ss",
      "parseDates": true
    },
    "chartCursor": {
      "enabled": true,
      "categoryBalloonDateFormat": "JJ:NN:SS"
    },
    "chartScrollbar": {
      "enabled": true
    },
    "trendLines": [],
    "graphs": [{
        "bullet": "round",
        "id": "AmGraph-1",
        "title": "Current",
        "valueField": "column1"
      },
      {
        "bullet": "square",
        "id": "AmGraph-2",
        "title": "Min",
        "valueField": "column2"
      },
      {
        "bullet": "square",
        "id": "AmGraph-3",
        "title": "Max",
        "valueField": "column3"
      }
    ],
    "guides": [],
    "valueAxes": [{
      "id": "ValueAxis-1",
      "title": ""
    }],
    "allLabels": [],
    "balloon": {},
    "legend": {
      "enabled": true,
      "useGraphSettings": true
    },
    "titles": [{
      "id": "Title-1",
      "size": 15,
      "text": "Historique"
    }]
  };

  chartConfig.dataProvider = tab;

  AmCharts.makeChart(id, chartConfig);

}


function MqttBroker() {
  $(document).ready(function () {
      /*function debug(str) {
          $('#debug').append('<p>' + str + '</p>');
      };*/
      ws = new WebSocket('ws://51.38.239.114:8080');

      ws.onmessage = function (evt) {
          /*$('#msg').append('<p>' + evt.data + '</p>');*/

          Historique("D1");
          Historique("D2");
          Historique("D3");
          Historique("D4");
          Historique("D5");
          Historique("D6");
          Historique("D7");

      };
      ws.onclose = function () {
          console.log('socket closed');
      };
      ws.onopen = function () {
          console.log('connected...');
      };
  });
}
