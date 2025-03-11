$(document).ready(function() {
    // Disable browser scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    var lastPos = document.body.scrollTop || document.documentElement.scrollTop;
    var perspective = 300;
    var zSpacing = 1000; // Positive value for opposite direction
    var zVals =[];
    var $frames = $(".frame");
    var frames = $frames.toArray();
    var numFrames = $frames.length;

    // Set up frame positions but make them invisible
    for (var i = 0; i < numFrames; i++) {
        zVals.push((i + 1) * zSpacing - 1000); // Adjusted initial position
        frames[i].style.transform = "translateZ(" + zVals[i] + "px)";
        // Hide frames initially
        $(frames[i]).css({ 'opacity': 0, 'display': 'block' });
    }

    function updateFrames(delta) {
        var maxArea = 0;
        var currentCaption = "";

        for (var i = 0; i < numFrames; i++) {
            var newZVal = (zVals[i] += (delta * 1.5)); // Positive multiplier
            var frame = frames[i];
            var transform = "translateZ(" + newZVal + "px)";
            
            // Conditionally set opacity based on whether the frame has been revealed
            var opacity = $(frame).hasClass('revealed') ? 1 : frame.style.opacity; 
            var display = newZVal > perspective ? "none" : "block";

            frame.style.transform = transform;
            frame.style.display = display;
            frame.style.opacity = opacity; // Use the conditional opacity

            // Calculate visible area of frame
            var visibleArea = getVisibleArea(frame);
            
            // Update caption if visible area is larger than current max
            if (visibleArea > maxArea && $(frame).hasClass('revealed')) {
                maxArea = visibleArea;
                currentCaption = $(frame).data('caption');
            }
        }

        // Update caption text after iterating through all frames
        if ($("#caption-container").hasClass('revealed')) {
            $('#caption-text').text(currentCaption);
        }
    }

    $(window).scroll(function() {
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        var delta = lastPos - top;
        lastPos = top;
        updateFrames(delta);
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
    
    // Add reset mechanism for when scroll gets stuck
    $(document).keydown(function(e) {
        // Reset when user presses 'R' key
        if (e.key.toLowerCase() === 'r' && e.ctrlKey === false) {
            $(window).scrollTop($(document).height());
            $(window).trigger('scroll');
            e.preventDefault();
        }
    });

    // Remove logo reveal animation (make it visible from the start)
    $("#logo").css('opacity', 1); // Initially show the logo
    
    // Scroll to bottom on load, refresh frames, and start reveal sequence
    setTimeout(function() {
        $(window).scrollTop($(document).height());
        $(window).trigger('scroll'); // Force update after setting scroll position
        startRevealSequence();
    }, 300);
    
    function startRevealSequence() {
        // Start revealing frames from the closest one first (index numFrames-1)
        revealFramesSequentially(numFrames - 1);
    }
    
    function revealFramesSequentially(index) {
        if (index < 0) {
            // All frames revealed, now show caption
            $("#caption-container").animate({ opacity: 1 }, 200, function() {
                $("#caption-container").addClass('revealed');
            });
            return;
        }
        
        // Mark and reveal current frame
        $(frames[index]).addClass('revealed').animate({ opacity: 1 }, 150, function() {
            // Reveal next frame after a delay
            setTimeout(function() {
                revealFramesSequentially(index - 1); 
            }, 150); // Adjust the delay (in milliseconds) as needed
        });
    }

    // Delay to hide content on load
    setTimeout(function() {
        $('#content').removeClass('hidden'); // Only remove 'hidden' from #content
    }, 150);
});
