/*
 *  Author: David Allen
 *  Website: http://davidrallen.com
 *  Last Updated: 03/08/13
 *
 */

$(document).on('ready', function(){
/*******************************************
 *          Variable Declaration
 *******************************************/
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

/*******************************************
 *          Mouse Functions
 *******************************************/

  //when the mouse is moving on the image, drag the tag container
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

  //when the user starts creating the tag
  $('.canvas img').mousedown(function(e){
      e.preventDefault();
      if( done == false ){
        downX = e.pageX - $(this).offset().left;
        downY= e.pageY - $(this).offset().top;
        var style = "top:" + downY + "px; left:" + downX + "px; z-index:" + count + ";";
        $('.canvas').append('<div id ="tag_' + count + '" class="tag ' + $('.units').val() + '" style="' + style +'"></div>');
      }
  });

  //when the user finishes creating the tag
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
        generate_tag( tagID, point );
        $('.list').append('<li class="'+ tagID +'"><a class="list-item">' + unitType + '</a><ul class="sub-item"><li>Description:</li><li>asdf</li></ul></li>'); 

        count = count + 1;
      }
  });

  //when the mouse enters a list item, it will display 
  //the detailed information
  $(document).on('mouseenter', '.list-item', function(){
      $('.tag').removeClass('active');
      $('#' + $(this).parent().attr('class')).addClass('active');
      $(this).parent().find('ul').show();
  });

  //when the mouse enters a tag, it will become active
  //and a close button will be added 
  $(document).on('mouseenter', '.tag', function(){
      $('.tag').removeClass('active');
      $(this).addClass('active');
      $(this).append('<div class="tag-close">X</div>');
      cur_tag = $(this).attr('id');
  });

  //when the mouse leaves a tag, it will no longer be active
  //and the close button will disappear
  $(document).on('mouseleave', '.tag', function(){
      $('.tag').removeClass('active');
      $('.tag-close').remove();
      cur_tag = "";
  });

  //whcn the mouse leaves a list item, it will hide
  $(document).on('mouseleave', '.list-item', function(){
      $('.tag').removeClass('active');
      $(this).parent().find('ul').hide();
  });

/*******************************************
 *         Click Functions
 *******************************************/

  //check if the user is trying to finish their tags
  $('.done-btn').click( function (){
    $('.tag').addClass('tag-done');
    done = true;
  });

  //check if the user is trying enter edit mode
  $('.edit-btn').click( function (){
    $('.tag').removeClass('tag-done');
    done = false;
  });
   
  //check if the user is trying to delete a tag with the close button
  $(document).on('click', '.tag-close', function(){
    deleteTag( $(this).parent().attr('id') );
  });

  //check if the user is trying to delete a tag with the keyboard
  $(document).keyup( function(e){
    if ((e.keyCode == 68 && cur_tag != "") || (e.keyCode == 46 && cur_tag != "")){
      deleteTag( cur_tag );
      cur_tag = "";
    }
  });

  //display tags associated with a category
  $(document).on('click', '.units', function() {
      display_units( $(this).val() );
  });

/*******************************************
 *         Tag Generating Functions
 *******************************************/

  function regenerate_tags(){
    //tags may need to be regenerated when they are edited or deleted
    //we need to make sure that the indexes and coiunt variables are correct
    var iterator = 0;
    $('.tag').remove();
    $.each(points['tags'], function( i, tag ){
      //create a temporary tags object
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

 function generate_tag( tagID, point ){
    var unit = $('.units').val();
    var url = 'url(' + $('.canvas img').attr('src') + ') no-repeat -' + point.downX + 'px -' + point.downY + 'px';
    $('#' + tagID).css({background: url, border: 'none'});
 }

/*******************************************
 *         Tag Editing/Deletion Functions
 *******************************************/

  function deleteTag( id ){
    //remove the points from the object
    delete points['tags'][id];
    //remove the actual element
    $('#' + id).remove();
    compact_tags();
    regenerate_tags();
    generate_list();
  }

  function compact_tags(){
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

/*******************************************
 *        Tag Displaying Functions 
 *******************************************/

 function display_units( unit ){
   //hide all of the tags
    $('.tag').hide();
   //show only the units we want to see
    $('.' + unit).show();
 }

});
