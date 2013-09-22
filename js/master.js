(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

//jquery v1.8.0 is included in this mess. Copyright 2012 jQuery Foundation and other contributors.
//like something you see, but can't read this unholy mess? drop me a line at (mif)[at](awe)[minus](schaffhausen)[dot](com)

var $windowpane = $(window)

$(document).ready(function(){
	if ($.browser.msie && parseInt($.browser.version, 10) < 7) $('body').supersleight({shim: 'img/transparent.gif'});

	$windowpane.stellar()

	$('.slide').each(function(){
		$(this).css('height', $windowpane.height()-125)
	})

	$.ajax({
		type: "POST",
		dataType:'JSON',
		url: "php/getcovers.php"
	}).done( function(cover){
		$.each(cover, function(i, v){
			
		})
	})

	
})