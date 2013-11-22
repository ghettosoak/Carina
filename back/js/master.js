(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

//jquery v1.8.0 is included in this mess. Copyright 2012 jQuery Foundation and other contributors.

var $windowpane = $(window)
var $category, $inside, $project, $detail, $other;
var projSelected = false;
// var $proj_name, $proj_client, $proj_text, $proj_img;
var nowediting;
var imgsession = [];
var current_category;
var covering;
var current_proj;

$(document).ready(function(){
	if ($.browser.msie && parseInt($.browser.version, 10) < 7) $('body').supersleight({shim: 'img/transparent.gif'});
})

$windowpane.load(function(){
	$category = $('.category')
	$inside = $('.inside')
	$project = $('.project')
	$detail = $('.detail')
	$other = $('.other')

	// $proj_name = $('#proj_name')
	// $proj_client = $('#proj_client')
	// $proj_text = $('#proj_text')
	// $proj_img = $('#proj_img')

	cover_pull()

	$('.body').css('height', $windowpane.height()-50)

})

function cover_pull(){
	$.ajax({
		type: "POST",
		dataType:'JSON',
		url: "php/getcovers.php"
	}).done( function(cover){
		$.each(cover, function(i, v){
			console.log(v)
			if ((i) == 0) $other.find('div[data-pointer="'+(i+1)+'"]').append('<p>'+v+'</p>')
			else $other.find('div[data-pointer="'+(i+1)+'"]').css('background-image', 'url(../'+v+')')//.append('<img src="../'+v+'" />')

			if (i == $category.children('div').size()) cat_select();
		})
	})
}

function cat_select(){
	console.log('CAT SELECTED')
	$category.off().on('click', '.cat', function(){
		var $that = $(this)
		current_category = $that.data('pointer')
		$that.addClass('selected').siblings().removeClass('selected')

		if (current_category !== 'carina'){

			$project.removeClass('hiding')
			$detail.removeClass('hiding')
			$other.addClass('hiding')

			$.ajax({
				type: "POST",
				dataType:'JSON',
				data:{
					category: current_category
				},
				url: "php/getcategory.php"
			}).done( function(proj){
				render('proj_menu', proj, function(returned){
					$project.empty().append(returned)
					proj_select();
				})
			})
		}else{ //IS HER

			$project.addClass('hiding')
			$detail.addClass('hiding')
			$other.removeClass('hiding')
			.find('.her').removeClass('hiding')
			.siblings().addClass('hiding')

			$.ajax({
				type: "POST",
				dataType:'JSON',
				url: "php/getcarina.php"
			}).done( function(her){
				console.log(her)				
				
				$('#her_email').val(her.email)
				$('#her_phone').val(her.phone)
				$('#her_text').val(her.text)
			})
		}
	}).on('click', '.inside', function(e){
		e.stopPropagation();

		var $that = $(this)

		$project.addClass('hiding')
		$detail.addClass('hiding')

		$other.removeClass('hiding') 
		.find('.cover').removeClass('hiding').addClass('active')
		.siblings().addClass('hiding')

		covering = $that.data('pointer')

		$other.find('div[data-pointer="'+covering+'"]').removeClass('hiding')
		.siblings().not('p, #drop').addClass('hiding')

		if ($that.hasClass('coverimg')){
			$('.droptxt_img').removeClass('hiding')
			.siblings('p').addClass('hiding')
		}else if ($that.hasClass('cv')){
			$('.droptxt_file').removeClass('hiding')
			.siblings('p').addClass('hiding')
		}
	})
}

function proj_select(){
	if (projSelected) $project.find('div').sortable('destroy');
	projSelected = true;

	$project.off().on('click', 'div', function(){
		var $that = $(this)
		nowediting = $that.data('pointer')

		if (nowediting !== 'NEW'){
			$.ajax({
				type: "POST",
				dataType:'JSON',
				data:{
					whichproj: nowediting
				},
				url: "php/getproject.php"
			}).done( function(proj){
				console.log(proj)

				current_proj = proj.details;

				$detail.addClass('active')
				$that.addClass('selected').siblings().removeClass('selected')

				if (proj.details.frontpromoted === '1') $('.proj_frontpromotion').addClass('promoted')
				else $('.proj_frontpromotion').removeClass('promoted')

				if (proj.details.allprojpromoted === '1') $('.proj_allprojpromotion').addClass('promoted')
				else $('.proj_allprojpromotion').removeClass('promoted')

				$('#proj_name').val(proj.details.name)
				$('#proj_client').val(proj.details.client)
				$('#proj_text').val(proj.details.text)

				$('#proj_img').empty()

				render('proj_img', proj.details, function(returned){
					$detail.find('#proj_img').append(returned)

					// $('#proj_img').find('div[data-img="'+proj.details.+'"]')

					$('.img_kill').off().on('click', function(e){
						var $that = $(this)
						$.ajax({
							type: "POST",
							dataType:'JSON',
							data:{
								kill:$that.parent().data('img')
							},
							url: "php/img_delete.php"
						}).done( function(youarehere){
							$that.parent().remove();
						})
					})

					$('.img_tile').off().on('click', function(e){
						var $that = $(this);
						$that.addClass('yeahthistile1')
						.parent().siblings().find('.img_tile').removeClass('yeahthistile1')
					})
				})
				
			})
		}else{ //ADD PROJECT
			$.ajax({
				type: "POST",
				dataType:'JSON',
				data:{
					category:current_category
				},
				url: "php/new.php"
			}).done( function(youarehere){
				nowediting = youarehere
				$('#proj_name').val('')
				$('#proj_client').val('')
				$('#proj_text').val('')
				$('#proj_img').empty()

				$category.find('[data-pointer="'+current_category+'"]').click()

				$project.find('[data-pointer="'+nowediting+'"]').addClass('selected')
			})
		}
	})
	.sortable();

	$('.proj_kill').off().on('click', function(e){
		e.stopPropagation();
		var $that = $(this)
		$.ajax({
			type: "POST",
			dataType:'JSON',
			data:{
				kill:$that.parent().data('pointer')
			},
			url: "php/proj_delete.php"
		}).done( function(youarehere){
			$that.parent().remove();
		})
	})
}

$('#proj_name').on('keyup', function(e){
	$project.find('[data-pointer="'+nowediting+'"] p').html($(this).val())
})

$('.promoter').on('click', function(){
	var $that = $(this)
	if ($that.hasClass('proj_allprojpromotion')) $that.toggleClass('promoted')
	else $that.addClass('promoted')
})

$('#save').on('click', function(){
	$savebutton = $(this)
	if (current_category !== 'carina'){

		var thisisthetitleimage = $('.yeahthistile1').parent().data('img')
		var andthisisitspath;

		$.each(current_proj.img, function(e, i){
			if (i.id == thisisthetitleimage) andthisisitspath = i.path.split('/')[2];
		})

		var theOrder = [];
		$project.find('div').each(function(e){
			var theIndex = $(this).data('pointer');
			if (theIndex !== 'NEW') theOrder[e] = theIndex;
		})

		$.ajax({
			type: "POST",
			dataType:'JSON',
			data:{
				whichproj: nowediting,
				category: current_category,
				name: $('#proj_name').val(),
				client: $('#proj_client').val(),
				text: $('#proj_text').val(),
				tile: $('.yeahthistile1').parent().data('img'),
				tilepath: andthisisitspath,
				frontpromote:$('.proj_frontpromotion').hasClass('promoted'),
				allprojpromote:$('.proj_allprojpromotion').hasClass('promoted'),
				imgs:imgsession,
				order:theOrder
			},
			url: "php/save.php"
		}).done( function(ohyeah){
			$savebutton.addClass('saved')
			setTimeout(function(){$savebutton.removeClass('saved')},3000)
		})
	}else{
		$.ajax({
			type: "POST",
			dataType:'JSON',
			data:{
				email: $('#her_email').val(),
				phone: $('#her_phone').val(),
				text: $('#her_text').val()
			},
			url: "php/save_her.php"
		})
	}
})

$('#proj_img').filedrop({
	fallback_id: 'me',
	paramname:'me_image',
	
	url: 'php/img_put.php',
	maxfilesize: 20,

	data:{ proj: nowediting },
	
	uploadFinished:function(i,file,response){

		$('#meimgs').find('div').last().attr('data-img', response.img_id); 

		$('.img_kill').css('z-index','1000').on('click', function(){
			var $waitme = $(this).parent()
			var $thisone = $waitme.data('img');
			$.ajax({
				type: "POST",
				dataType:'JSON',
				data:{kill: $thisone},
				url: "../back/php/killmeimg.php"
			}).done(function(){
				$waitme.remove();
			})
		});

		imgsession.push(response.img_id);
	},
	
	error: function(err, file) { alert("it didn't work. here's why, maybe: "+err) },
	
	beforeEach: function(file){
		console.log(file.type)
		if(!file.type.match(/^image\/jpeg/)){
			alert('jpegs only kthx');
			return false;
		}
	},

	uploadStarted:function(i, file, len){
		var preview = $('<div></div>')
		var reader = new FileReader();
		
		reader.onload = function(e){ preview.css('background-image','url('+e.target.result+')'); };
		reader.readAsDataURL(file);
		preview.appendTo('#proj_img');
		preview.append('<img src="../back/img/kill.png" class="img_kill" />')
		$.data(file,preview);			
	}	 
});

$('#drop').filedrop({
	fallback_id: 'me',
	paramname:'covered',
	
	url: 'php/coversave.php',
	maxfilesize: 20,

	data:{
		cover: function(){
			return covering;
		}
	},
		
	error: function(err, file) { alert("it didn't work. here's why, maybe: "+err+"\ntry it again.") },
	
	beforeEach: function(file){
		console.log(covering)
		if(!file.type.match(/^image\/jpeg/) && !file.type.match(/^application\/pdf/) ){
			alert('jpegs & PDFs only kthx');
			return false;
		}
	},

	uploadStarted:function(i, file, len){
		var preview = $('<div></div>')
		var reader = new FileReader();

		if (covering == 1) $other.find('div[data-pointer="'+covering+'"] p').html('store/cover/'+file.name); 		
		else{
			reader.onload = function(e){ $other.find('div[data-pointer="'+covering+'"]').css('background-image','url('+e.target.result+')'); };
			reader.readAsDataURL(file);
			$.data(file,preview);				
		}
	}
});


var mustacheCache = {};
/**
 * This wraps the mustache rendering in a single function.
 * It will ajax and compile the template (or use locally if available)
 * @param template string template name to load or get from cache
 * @param data render data to use
 * @param callback callback gives output string
 */
var render = function (template, data, callback) {
    // template is in cache
    if (mustacheCache[template] !== undefined) {
        callback(mustacheCache[template](data));
    }
    // We have to load and compile the template first
    else {
        $.ajax({
            url: 'inc/'+template+'.mustache',
            success: function(rawTemplate) {
                // cache the template for later use
                mustacheCache[template] = Mustache.compile(rawTemplate);
                // Then render it can callback
                callback(mustacheCache[template](data));
            },
            error: function ( jqXHR, textStatus, errorThrown) {
                throw new Error(errorThrown);
            },
            dataType: 'text'
        });
    }
};
