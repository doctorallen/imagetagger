$(document).on('ready', function(){
  var points = [];
  var downX = 0;
  var downY = 0;
  var upX = 0;
  var upY = 0;
  var count = 0;
  $('.canvas img').mousemove(function(e){
    if( downX != 0 && downY != 0){
      upX = e.pageX - $(this).offset().left;
      upY= e.pageY - $(this).offset().top;
      $('#cur_box_' + count).css('height', Math.abs(downY - upY));
      $('#cur_box_' + count).css('width', Math.abs(downX - upX));
    }
  });
  $('.canvas img').mousedown(function(e){
      e.preventDefault();
      downX = e.pageX - $(this).offset().left;
      downY= e.pageY - $(this).offset().top;
      var style = "top:" + downY + "px; left:" + downX + "px; z-index:" + count + ";";
      $('.canvas').append('<div id ="cur_box_' + count + '" class="box ' + $('.units').val() + '" style="' + style +'"></div>');
  });
  $('.canvas img').mouseup(function(e){
      console.log(count);
      e.preventDefault();
      var point = {
        downX: downX,
        downY: downY,
        upX: upX,
        upY: upY,
        unit: $('.units').val()
      };
      points['cur_box_' + count] = point;
      console.log(points);
      generate_background();
      $('.list').append('<li>cur_box_' + count + '</li>'); 

        
      count = count + 1;
  });
 function generate_background(){
    //$('.box').hide();
    var units = $('.units');
    $('.' + units.val()).each(function(){
        var box = $(this);
        box.show();
        var point = points[box.attr('id')];
        var url = 'url(skywatcher.jpg) no-repeat -' + point.downX + 'px -' + point.downY + 'px';
        console.log(box);
        console.log(url);
        box.css({background: url, border: 'none'});
      });
 }
  $(document).on('click', '.units', function() {
        $('.box').hide();
    $('.' + $(this).val()).each(function(){
        var box = $(this);
        box.show();
        var point = points[box.attr('id')];
        var url = 'url(skywatcher.jpg) no-repeat -' + point.downX + 'px -' + point.downY + 'px';
        console.log(box);
        console.log(url);
        box.css({background: url});
      });
  });

});
