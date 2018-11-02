function ChangeCanvas1(Capteur) {
    $(document).ready(function () {
        function debug(str) {
            $('#debug').append('<p>' + str + '</p>');
        };
        ws = new WebSocket('ws://51.38.239.114:8080');

        ws.onmessage = function (evt) {
            /*$('#msg').append('<p>' + evt.data + '</p>');*/
            var obj;
            obj = JSON.parse(evt.data);
        ws.onclose = function () {};
        ws.onopen = function () {};
        if(obj.id==Capteur){
  var nb = obj.temperature.current;
  var height = 129-(nb*1.8);
  document.getElementById("TempText"+Capteur).innerHTML=nb+"°C";
  console.log("therm");
  //alert(height);
  var canvas = document.getElementById('canvas1'+obj.id);
  var ctx = canvas.getContext('2d');


  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 200, 200);

  if (height<=129) {
    height=height/1.5;
    ctx.fillStyle = 'red';
    ctx.fillRect(0, height, 200, 200);
  }else{
    height=height/1.5;
    ctx.fillStyle = '#01CAFF';
    ctx.fillRect(0, height, 200, 200);
 }


}
          };
      });
}


function ChangeCanvas2(Capteur) {
  $(document).ready(function () {
      function debug(str) {
          $('#debug').append('<p>' + str + '</p>');
      };
      ws = new WebSocket('ws://51.38.239.114:8080');

      ws.onmessage = function (evt) {
          /*$('#msg').append('<p>' + evt.data + '</p>');*/
          var obj;
          obj = JSON.parse(evt.data);
      ws.onclose = function () {};
      ws.onopen = function () {};
      if (obj.id==Capteur) {
        var nb = obj.humidity.current;
        var height = 99-(nb*0.62);
        document.getElementById("HumText"+Capteur).innerHTML=nb+"%";
        console.log('success');
        var canvas = document.getElementById('canvas2'+obj.id);
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 200, 200);

        ctx.fillStyle = 'blue';
        ctx.fillRect(0, height, 200, 200);
}

        };
      });
}
