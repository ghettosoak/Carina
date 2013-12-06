(function(a){function b(){}for(var c='assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn'.split(','),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

//jquery v1.8.0 is included in this mess. Copyright 2012 jQuery Foundation and other contributors.
//like something you see, but can't read this unholy mess? drop me a line at (mif)[at](awe)[minus](schaffhausen)[dot](com)

var $windowPane = $(window);
var $theSections;
var paneHeight, paneWidth;
var sectionHeight;
var paneMode = {};
var depth = 0, panel = 0, panelreg = 0, position = 0;
var large;
var $master = $('#master');
var $top = $('#top');
var $front = $('#front');
var $grid = $('#grid');
var $project = $('#project');
var $carousel = $('#carousel');
var $interest = $('#interest')
var hash;
var hashhistory = [];

$(document).ready(function(){
	$windowPane.resize(projectReprepare);

	paneHeight = $windowPane.height();
	paneWidth = $windowPane.width();

	sectionHeight = paneHeight-200;

	if (paneWidth < 786) paneMode.horiz = 'mobile';
	if ((paneWidth >= 786) && (paneWidth < 1024)) paneMode.horiz = 'tablet';
	if (paneWidth >= 1024) paneMode.horiz = 'desktop';

	if (window.location.hash){
		hash = window.location.hash.split('#')[1];
		console.log(hash);
		if (hash.indexOf('all_proj') === 0) all_projLoader();
		if (hash.indexOf('about') === 0) interestLoader('about');
		if (hash.indexOf('contact') === 0) interestLoader('contact');

		if (hash.indexOf('home') === 0) frontLoader();
		if (hash.indexOf('category') === 0) gridLoader(hash.split('-')[1]);
		if (hash.indexOf('project') === 0) projectLoader(hash.split('-')[1]);
	}else{
		window.location.hash = 'home';
	}
});

var projectReprepare = _.debounce(function(){
	if (hash.indexOf('category') === 0) gridEnsure();
	if (hash.indexOf('project') === 0){
		projectPrepare($project);
		$proj_img_carousel.css('left', -galleryposition*$proj_img_carousel.parent().width());
	}
},250)

$front.find('p').on('click', function(){
	window.location.hash = 'category-'+$(this).parent().siblings('.back').data('category');
})

$top.find('.alt_nav span').on('click', function(){
	window.location.hash = $(this).data('pointer');
})

$top.find('.cat_nav div').on('click', function(){
	window.location.hash = 'category-'+$(this).data('pointer');
})

$top.find('#logo').on('click', function(){
	window.location.hash = 'home';
})

$windowPane.bind('hashchange', function(){
	hash = window.location.hash.split('#')[1];

	if (hash.indexOf('all_proj') === 0) all_projLoader();
	if (hash.indexOf('about') === 0) interestLoader('about');
	if (hash.indexOf('contact') === 0) interestLoader('contact');
	
	if (hash.indexOf('home') === 0) frontLoader();
	if (hash.indexOf('category') === 0) gridLoader(hash.split('-')[1]);
	if (hash.indexOf('project') === 0) projectLoader(hash.split('-')[1]);
	hashhistory.push(hash);

	console.log(hash)
});


function arewethereyet(acategory){
	if (paneMode.horiz !== 'desktop'){
		setTimeout(function(){
			var grip;

			if (hash.indexOf('about') === 0 || hash.indexOf('contact') === 0) grip = $interest.outerHeight(true) + 200
			if (hash.indexOf('home') === 0) grip = $front.outerHeight(true) + 200
			if (hash.indexOf('category') === 0 || hash.indexOf('all_proj') === 0) grip = $grid.find('#grid_inside').outerHeight(true) + 500
			if (hash.indexOf('project') === 0) grip = $project.outerHeight(true) + 300

			$carousel.css('height', grip);	
		}, 1000)
	}else $carousel.css('height', '100%');

	$master.removeClass(function(){
		var theClasses = $(this)[0].className.split(' ');
		console.log(theClasses)
		if (theClasses.indexOf('ready') !== -1) theClasses.splice( theClasses.indexOf('ready'), 1 );
		return theClasses.join(' ');
	})

	if (hash.indexOf('about') === 0 || hash.indexOf('contact') === 0) $master.addClass('lookingat_interest');
	if (hash.indexOf('home') === 0) $master.addClass('lookingat_front');
	if (hash.indexOf('category') === 0 || hash.indexOf('all_proj') === 0) $master.addClass('lookingat_grid '+hash);
	if (hash.indexOf('project') === 0) $master.addClass('lookingat_project category-'+acategory);

	if ((hashhistory.length === 0) || (hashhistory.length === 1)){
		setTimeout(function(){ 
			$master.addClass('ready');
		},500)
	}

	console.log('DONE WITH '+hash.toUpperCase()+'; hashhistory == '+hashhistory.length);
}

function all_projLoader(){
	$.ajax({
		type: 'POST',
		dataType:'JSON',
		url: 'php/getallprojects.php'
	}).done( function(tiles){
		render('tile', tiles, function(returned){
			$grid.find('#grid_inside').empty().append(returned)
			.find('.tile').on('click', function(){
				window.location.hash = 'project-'+$(this).data('pointer');
			})
			gridEnsure();
		});

		arewethereyet();
	});
}

function interestLoader(which){ 
	$.ajax({
		type: 'POST',
		dataType:'JSON',
		url: 'php/get'+which+'.php'
	}).done( function(interest){
		render(which, interest, function(returned){
			$interest.empty().append(returned);
		});
		arewethereyet();
	});

	console.log(which.toUpperCase()+' LOADED'); 
}

function frontLoader(){
	$.ajax({
		type: 'POST',
		dataType:'JSON',
		url: 'php/getcovers.php'
	}).done( function(cover){
		$.each(cover, function(i, v){
			$front.find('#slide0'+(i+1)).css('background-image','url('+v+')');
		});

		arewethereyet();
	});

	if (paneMode.horiz === 'desktop'){
		$theSections = $front.children('div');

		$theSections = $front.children('div').each(function(){
			$(this).css('height', sectionHeight)
			.find('p').css('top',  randomInt(0, (sectionHeight-400)));
		});

		$front.scroll(function(e){
			shifter($(this).scrollTop());
		});
	}

	console.log('FRONT LOADED');
}

function gridLoader(ing){
	$.ajax({
		type: 'POST',
		dataType:'JSON',
		data:{
			category:ing
		},
		url: 'php/getgrid.php'
	}).done( function(tiles){
		render('tile', tiles, function(returned){
			$grid.find('#grid_inside').empty().append(returned)
			.find('.tile').on('click', function(){
				window.location.hash = 'project-'+$(this).data('pointer');
			})
			gridEnsure();
		})

		arewethereyet();
	});

	console.log('GRID LOADED');
}

function gridEnsure(){
	var $insideDiv = $grid.find('#grid_inside>div')
	$insideDiv.css('height', $insideDiv.first().css('width'))
}


function projectLoader(ing){
	galleryposition = 1
	$.ajax({
		type: 'POST',
		dataType:'JSON',
		data:{
			project:ing
		},
		url: 'php/getproject.php'
	}).done( function(proj){
		render('project', proj, function(returned){
			projectPrepare($project.empty().append(returned))
		});

		arewethereyet(proj.project.category);
	});

	console.log('PROJECT LOADED');
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
	console.log(there)
    panel = (Math.floor(there / sectionHeight))+1;
    position = (there % sectionHeight);

    if (panel !== panelreg){
        $theSections.removeClass()
        $('#sec0'+panel).addClass('here')
    }

    panelreg = panel;

    console.log(there+' // '+panel+' // '+ position)

    // CURRENT
    $('#slide0'+panel).css('top', map_range(position, 0, sectionHeight, -25, 0)+'%');

    // NEXT
    $('#slide0'+(panel+1)).css('top', map_range(position, 0, sectionHeight, -50, -25)+'%');
}



















