$(document).on('ready', function(){
  var points = {};
  points['image'] = {
    src: $('.canvas img').attr('src'),
    description: "Image Description",
    game: "Generals 2",
    date: new Date()
  };
  points['tags'] = {};
  var downX = 0;
  var downY = 0;
  var upX = 0;
  var upY = 0;
  var count = 0;
  $('.canvas img').mousemove(function(e){
    if( downX != 0 && downY != 0){
      upX = e.pageX - $(this).offset().left;
      upY= e.pageY - $(this).offset().top;
      var tag = $('#tag_' + count);
      if( upX < downX  ){
        tag.css('left', upX);
      }
      if( upY < downY ){
        tag.css('top', upY);
      }
      tag.css('height', Math.abs(downY - upY));
      tag.css('width', Math.abs(downX - upX));
    }
  });
  $('.canvas img').mousedown(function(e){
      e.preventDefault();
      downX = e.pageX - $(this).offset().left;
      downY= e.pageY - $(this).offset().top;
      var style = "top:" + downY + "px; left:" + downX + "px; z-index:" + count + ";";
      $('.canvas').append('<div id ="tag_' + count + '" class="tag ' + $('.units').val() + '" style="' + style +'"></div>');
  });
  $('.canvas img').mouseup(function(e){
      e.preventDefault();
      var tagID = 'tag_' + count;
      var unitType = $('.units').val();
      //if the user drew the tag from right to left, swap the coordinates
      if( upX < downX ){
        var temp = downX;
        downX = upX;
        upX = temp;
      }
      //if the user drew the tag from bottom to top, swap the coordinates
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
      points['tags'][tagID] = point;
      console.log('points');
      console.log(points);
      console.log(JSON.stringify(points));
      generate_background();
      $('.list').append('<li class="'+ tagID +'"><a class="list-item">' + unitType + '</a><ul class="sub-item"><li>Description:</li><li>asdf</li></ul></li>'); 

        
      count = count + 1;
  });
  $(document).on('mouseenter', '.list-item', function(){
      $('.tag').removeClass('active');
      $('#' + $(this).parent().attr('class')).addClass('active');
      $(this).parent().find('ul').show();
  });
  $(document).on('mouseenter', '.tag', function(){
      $('.tag').removeClass('active');
      $(this).addClass('active');
  });
  $(document).on('mouseout', '.tag', function(){
      $('.tag').removeClass('active');
  });
  $(document).on('mouseout', '.list-item', function(){
      $('.tag').removeClass('active');
      $(this).parent().find('ul').hide();
  });
  $('.done-btn').click( function (){
    $('.tag').addClass('tag-done');
      });
 function generate_background(){
    //$('.tag').hide();
    var units = $('.units');
    $('.' + units.val()).each(function(){
        var tag = $(this);
        tag.show();
        var point = points['tags'][tag.attr('id')];
        var url = 'url(' + $('.canvas img').attr('src') + ') no-repeat -' + point.downX + 'px -' + point.downY + 'px';
        tag.css({background: url, border: 'none'});
      });
 }
  $(document).on('click', '.units', function() {
        $('.tag').hide();
    $('.' + $(this).val()).each(function(){
        var tag = $(this);
        tag.show();
        var point = points['tags'][tag.attr('id')];
        var url = 'url(' + $('.canvas img').attr('src') + ') no-repeat -' + point.downX + 'px -' + point.downY + 'px';
        tag.css({background: url});
      });
  });

});
