$(document).ready(function() {
    var lastPos = document.body.scrollTop || document.documentElement.scrollTop;
    var perspective = 300;
    var zSpacing = 1000; // Positive value for opposite direction
    var zVals =[];
    var $frames = $(".frame");
    var frames = $frames.toArray();
    var numFrames = $frames.length;

    for (var i = 0; i < numFrames; i++) {
        zVals.push((i + 1) * zSpacing - 1000); // Adjusted initial position
        frames[i].style.transform = "translateZ(" + zVals[i] + "px)";
    }

    $(window).scroll(function() {
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        var delta = lastPos - top;
        lastPos = top;

        var maxArea = 0;
        var currentCaption = "";

        for (var i = 0; i < numFrames; i++) {
          var newZVal = (zVals[i] += (delta * 1.5)); // Positive multiplier
          var frame = frames[i];
          var transform = "translateZ(" + newZVal + "px)";
          var opacity = newZVal < 200 ? 1 : 1 - parseInt((newZVal - 200) / (perspective - 200) * 10) / 10;
          var display = newZVal > perspective ? "none" : "block";

          frame.style.transform = transform;
          frame.style.display = display;
          frame.style.opacity = opacity;

          // Calculate visible area of frame
          var visibleArea = getVisibleArea(frame);

          // Update caption if visible area is larger than current max
          if (visibleArea > maxArea) {
            maxArea = visibleArea;
            currentCaption = $(frame).data('caption');
          }
        }

        // Update caption text after iterating through all frames
        $('#caption-text').text(currentCaption);
    });

    function getVisibleArea(el) {
        var rect = el.getBoundingClientRect();
        var visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
        var visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        return visibleWidth * visibleHeight;
    }

    // Logo Click Event
    $("#logo").click(function() {
        $("#content, #caption-container").toggleClass("blur-effect");
        $("#logo-message").fadeToggle();  // Show/Hide message
    });

   // Scroll to bottom on load 
   $(window).scrollTop($(document).height()); 
});