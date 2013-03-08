$(document).on('ready', function(){
  var points = {};
  var cur_tag = "";
  var done = false;
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
    if( downX != 0 && downY != 0 && done == false){
      upX = e.pageX - $(this).offset().left;
      upY= e.pageY - $(this).offset().top;
      var tag = $('#tag_' + count);
      var temp_downX = downX;
      var temp_downY = downY;
      if( upX < downX  ){
        tag.css('left', upX);
        temp_downX = upX;
      }
      if( upY < downY ){
        tag.css('top', upY);
          temp_downY = upY;
      }

      tag.css('height', Math.abs(downY - upY));
      tag.css('width', Math.abs(downX - upX));
      var url = "url(" + points.image.src+ ") no-repeat -" + temp_downX + "px -" + temp_downY + "px"
      tag.css('background', url);
    }
  });
  $('.canvas img').mousedown(function(e){
      e.preventDefault();
      if( done == false ){
        downX = e.pageX - $(this).offset().left;
        downY= e.pageY - $(this).offset().top;
        var style = "top:" + downY + "px; left:" + downX + "px; z-index:" + count + ";";
        $('.canvas').append('<div id ="tag_' + count + '" class="tag ' + $('.units').val() + '" style="' + style +'"></div>');
      }
  });
  $('.canvas img').mouseup(function(e){
      e.preventDefault();
      if( done == false ){
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
      }
  });

  $(document).on('mouseenter', '.list-item', function(){
      $('.tag').removeClass('active');
      $('#' + $(this).parent().attr('class')).addClass('active');
      $(this).parent().find('ul').show();
  });

  $(document).on('mouseenter', '.tag', function(){
      $('.tag').removeClass('active');
      $(this).addClass('active');
      cur_tag = $(this).attr('id');
      console.log(cur_tag);
  });

  $(document).on('mouseout', '.tag', function(){
      $('.tag').removeClass('active');
      cur_tag = "";
      console.log(cur_tag);
  });

  $(document).on('mouseout', '.list-item', function(){
      $('.tag').removeClass('active');
      $(this).parent().find('ul').hide();
  });

  $('.done-btn').click( function (){
    $('.tag').addClass('tag-done');
    done = true;
  });

  $('.edit-btn').click( function (){
    $('.tag').removeClass('tag-done');
    done = false;
  });

  $(document).keyup( function(e){
    console.log(e.keyCode);
    console.log(cur_tag);
    if (e.keyCode == 68 && cur_tag != ""){
      deleteTag( cur_tag );
      cur_tag = "";
    }
    
  });

  function deleteTag( id ){
    console.log('before delete:', JSON.stringify(points));
    //remove the points from the object
    delete points['tags'][id];
    //remove the actual element
    $('#' + id).remove();
    regenerate();
    regenerate_tags();
    console.log('after delete:', JSON.stringify(points));
    generate_list();
  }

  function regenerate(){
    //tags may need to be regenerated when they are edited or deleted
    //we need to make sure that the indexes and coiunt variables are correct
    var tags = {};
    var iterator = 0;
    $('.tag').remove();
    $.each(points['tags'], function( i, tag ){
      //create a temporary tags object
      tags['tag_' + iterator] = tag;
      iterator = iterator + 1;
    });
    points['tags'] = tags;
    count = iterator;
  }

  function regenerate_tags(){
    //tags may need to be regenerated when they are edited or deleted
    //we need to make sure that the indexes and coiunt variables are correct
    var iterator = 0;
    $('.tag').remove();
    $.each(points['tags'], function( i, tag ){
      //create a temporary tags object
      console.log('iterator:', iterator);
      console.log('i:', i);
      var style = "background: url(" + points.image.src+ ") no-repeat -" + tag.downX + "px -" + tag.downY + "px; top:" + tag.downY + "px; left:" + tag.downX + "px; z-index:" + iterator + "; height:" + Math.abs(tag.downY - tag.upY) + "px; width:"+ Math.abs(tag.downX - tag.upX) + "px;";
      $('.canvas').append('<div id ="'+ i + '" class="tag tag-done ' + tag.unit + '" style="' + style +'"></div>');
      iterator = iterator + 1;
    });
  }

  function generate_list(){
    //remove the list already in the ul
    $('.list').html('');
    //loop through all the tags to build the list
    $.each(points['tags'], function( i, tag ){
      $('.list').append('<li class="'+ i +'"><a class="list-item">' + tag.unit + '</a><ul class="sub-item"><li>Description:</li><li>asdf</li></ul></li>'); 
    });

  }

  

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
