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
      var box = $('#cur_box_' + count);
      if( upX < downX  ){
        box.css('left', upX);
      }
      if( upY < downY ){
        box.css('top', upY);
      }
      box.css('height', Math.abs(downY - upY));
      box.css('width', Math.abs(downX - upX));
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
      var boxID = 'cur_box_' + count;
      var unitType = $('.units').val();
      //if the user drew the box from right to left, swap the coordinates
      if( upX < downX ){
        var temp = downX;
        downX = upX;
        upX = temp;
      }
      //if the user drew the box from bottom to top, swap the coordinates
      if( upY < downY ){
        var temp = downY;
        downY = upY;
        upY = temp;
      }
      var point = {
        downX: downX,
        downY: downY,
        upX: upX,
        upY: upY,
        unit: unitType
      };
      points[boxID] = point;
      console.log(points);
      generate_background();
      $('.list').append('<li class="'+ boxID +'"><a class="list-item">' + unitType + '</a><ul class="sub-item"><li>Description:</li><li>asdf</li></ul></li>'); 

        
      count = count + 1;
  });
  $(document).on('mouseenter', '.list-item', function(){
      $('.box').removeClass('active');
      $('#' + $(this).parent().attr('class')).addClass('active');
      console.log($(this));
      $(this).parent().find('ul').show();
  });
  $(document).on('mouseenter', '.box', function(){
      $('.box').removeClass('active');
      $(this).addClass('active');
  });
  $(document).on('mouseout', '.box', function(){
      $('.box').removeClass('active');
  });
  $(document).on('mouseout', '.list-item', function(){
      $('.box').removeClass('active');
      $(this).parent().find('ul').hide();
  });
  $('.done-btn').click( function (){
    $('.box').addClass('box-done');
      });
 function generate_background(){
    //$('.box').hide();
    var units = $('.units');
    $('.' + units.val()).each(function(){
        var box = $(this);
        box.show();
        var point = points[box.attr('id')];
        var url = 'url(generals2.jpg) no-repeat -' + point.downX + 'px -' + point.downY + 'px';
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
        var url = 'url(generals2.jpg) no-repeat -' + point.downX + 'px -' + point.downY + 'px';
        console.log(box);
        console.log(url);
        box.css({background: url});
      });
  });

});
