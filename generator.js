$(document).on('ready', function(){
    var count = 0;
    $.getJSON('http://dev.davidrallen.com/drawing/points.json', function( points ){
        console.log(points);
        $('.generate-btn').on('click', function(){
          generate_tags( points );
        });

        function generate_tags( points ){
          $.each(points.tags, function( i, tag){
            console.log(tag);
            var style = "background: url(" + points.image.src+ ") no-repeat -" + tag.downX + "px -" + tag.downY + "px; top:" + tag.downY + "px; left:" + tag.downX + "px; z-index:" + count + "; height:" + Math.abs(tag.downY - tag.upY) + "px; width:"+ Math.abs(tag.downX - tag.upX) + "px;";
      console.log(style);
            $('.canvas').append('<div id ="'+ i + '" class="tag tag-done ' + tag.unit + '" style="' + style +'"></div>');
            count = count + 1;
          });
        }
    });

});
