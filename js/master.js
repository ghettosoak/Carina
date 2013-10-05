(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

//jquery v1.8.0 is included in this mess. Copyright 2012 jQuery Foundation and other contributors.
//like something you see, but can't read this unholy mess? drop me a line at (mif)[at](awe)[minus](schaffhausen)[dot](com)

var $windowPane = $(window)
var $front, $theSections;
var paneHeight, paneWidth;
var sectionHeight;
var depth = 0, panel = 0, panelreg = 0, position = 0;
var large;

$(document).ready(function(){
	$front = $('#front');

	paneHeight = $windowPane.height();
	paneWidth = $windowPane.width();

	sectionHeight = paneHeight-125;

	$theSections = $front.children('div').not('.top_spacer')

	$theSections.each(function(){
		var $that = $(this)
		$that.css('height', sectionHeight)
		.find('p').css('top', randomInt(0, sectionHeight-200))
	});

	$.ajax({
		type: "POST",
		dataType:'JSON',
		url: "php/getcovers.php"
	}).done( function(cover){
		$.each(cover, function(i, v){
			$front.find('#slide0'+(i+1)).css('background-image','url('+v+')');
		});
	});

	$front.scroll(function(e){
		shifter($front.scrollTop());
	});
});




function shifter(there){
	panel = (Math.floor(there / sectionHeight))+1;
	position = (there % sectionHeight);

	if (panel !== panelreg){
		$theSections.removeClass()
		$('#sec0'+panel).addClass('here')
	}

	panelreg = panel;

	// CURRENT
	$('#slide0'+panel).css('top', map_range(position, 0, sectionHeight, -25, 0)+'%');

	// NEXT
	$('#slide0'+(panel+1)).css('top', map_range(position, 0, sectionHeight, -50, -25)+'%');
}

function map_range(value, low1, high1, low2, high2) {
    return (low2 + (high2 - low2) * (value - low1) / (high1 - low1)).toFixed(2);
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}




















