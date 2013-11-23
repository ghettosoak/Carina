-(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

//jquery v1.8.0 is included in this mess. Copyright 2012 jQuery Foundation and other contributors.
//like something you see, but can't read this unholy mess? drop me a line at (mif)[at](awe)[minus](schaffhausen)[dot](com)

var $windowPane = $(window)
var $theSections;
var paneHeight, paneWidth;
var sectionHeight;
var depth = 0, panel = 0, panelreg = 0, position = 0;
var large;
var $front = $('#front');
var $grid = $('#grid');
var $project = $('#project');
var $carousel = $('#carousel')
var hash;
var hashhistory = [];

$(document).ready(function(){

	$windowPane.resize(projectReprepare);

	paneHeight = $windowPane.height();
	paneWidth = $windowPane.width();

	sectionHeight = paneHeight-125;
	$theSections = $front.children('div').not('.top_spacer')

	$theSections.each(function(){
		$(this).css('height', sectionHeight)
		.find('p').css('top', randomInt(0, sectionHeight-200))
	});

	if (window.location.hash){
		hash = window.location.hash.split('#')[1];
		console.log(hash)
		if (hash.indexOf('home') === 0) frontLoader();
		if (hash.indexOf('category') === 0) gridLoader(hash.split('-')[1]);
		if (hash.indexOf('project') === 0) projectLoader(hash.split('-')[1]);
	}else{
		window.location.hash = 'home'
	}	
});

var projectReprepare = _.debounce(function(){
	projectPrepare($project);
	$proj_img_carousel.css('left', -galleryposition*$proj_img_carousel.parent().width())
},250)

$front.find('p').on('click', function(){
	window.location.hash = 'category-'+$(this).parent().siblings('.back').data('category');
})

$windowPane.bind('hashchange', function(){
	hash = window.location.hash.split('#')[1];
	if (hash.indexOf('home') === 0) frontLoader();
	if (hash.indexOf('category') === 0) gridLoader(hash.split('-')[1]);
	if (hash.indexOf('project') === 0) projectLoader(hash.split('-')[1]);
	hashhistory.push(hash)
});

$(document).ajaxComplete(function( event, request, settings ) {
	$carousel.removeClass('lookingat_front lookingat_grid lookingat_project')
	if (hash.indexOf('home') === 0) $carousel.addClass('lookingat_front');
	if (hash.indexOf('category') === 0) $carousel.addClass('lookingat_grid');
	if (hash.indexOf('project') === 0) $carousel.addClass('lookingat_project');

	if (hashhistory.length === 0) setTimeout(function(){ $carousel.addClass('ready') },500)
});

function frontLoader(){
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
}

function gridLoader(ing){
	if (hashhistory[hashhistory.length-2] !== hash){
		$.ajax({
			type: "POST",
			dataType:'JSON',
			data:{
				category:ing
			},
			url: "php/getgrid.php"
		}).done( function(tiles){
			render('tile', tiles, function(returned){
				$grid.append(returned)
				.find('.tile').on('click', function(){
					window.location.hash = 'project-'+$(this).data('pointer');
				})
			})
		});
	}
}

function projectLoader(ing){
	galleryposition = 1
	$.ajax({
		type: "POST",
		dataType:'JSON',
		data:{
			project:ing
		},
		url: "php/getproject.php"
	}).done( function(proj){
		render('project', proj, function(returned){
			projectPrepare($project.empty().append(returned))
		})
	});
}


var $proj_img_select;
var $proj_img_carousel;
var galleryposition = 1;

function projectPrepare($thisone){
	var $projimgs;

	$proj_img_carousel = $thisone
	.find('.proj_img_carousel').css('width', function(){
		var $that = $(this)
		$projimgs = $that.find('div')
		$proj_img_select = $that.parent().siblings('.proj_img_select')
		return $projimgs.size() * ($that.parent().width())
	})

	$projimgs.css('width', $proj_img_carousel.parent().width())

	$proj_img_select.find('p').each(function(e){
		$(this).html(e+1)
	})

	$proj_img_select.find('div').off().on('click', function(){
		galleryposition = $(this).index()
		$proj_img_carousel.css('left', -galleryposition*$proj_img_carousel.parent().width())
	})
}

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



















