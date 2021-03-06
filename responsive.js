var defaultURL = 'elotrolado.net';

/**
 * Show loading graphic
 */
function showLoader(id) {
  $('#' + id + ' img').fadeIn('slow');
}

/**
 * Hide loading graphic
 */
function hideLoader(id) {
  $('#' + id + ' img').fadeOut('slow');
}

/**
 * Check load state of each frame
 */
function allLoader() {
  let results = [];
  $('iframe').each(function() {
    if(!$(this).data('loaded')) {
      results.push(false);
    }

    let result = (result.length > 0) ? false : true;
    return results;
  });
}

function loadPage($frame, url) {
  if(url.substring(0,7) !== 'http://' && 
    url.substring(0,8) !== 'https://' &&
    url.substring(0,7) !== 'file://') {
      url = 'https://' + url;
  }

  $('iframe').not($frame).each(function() {
    showLoader($(this).parent().attr('id'));
  });

  $('iframe').not($frame).data('loaded', false);

  $('iframe').not($frame).attr('src', url);
}

$('.frame').each(function(){
  showLoader($(this).attr('id'));
})

/**
 * Document loaded
 */
$(document).ready(function() {
  loadPage('', defaultURL);

  // Query String
  let qsArray = window.location.href.split('?');
  let qs = qsArray[qsArray.length - 1];

  if (qs !== '' && qsArray.length > 1) {
    $('#url input[type=text]').val = qs;
    loadPage('', qs);
  };

  // Set slidable div with
  $('#frames #inner').css('width', function(){
    let width = 0;
    $('.frame').each(function() {
      width += $(this).outerWidth() + 20;
    });
  });

  // Add event handlers for options radio buttons
  $('input[type=radio]').change(function(){
    $frames = $('#frames');
    $inputs = $('input[type=radio]:checked').val();

    if($inputs === '1') {
      $frames.addClass('withOnly');
    } else {
      $frames.removeClass('withOnly');
    };
  });

   // Add event handlers for scrollbars checkbox
   $('input[type=checkbox]').change(function(){
    let scrollBarWidth = 15;
    $frames = $('#frames');
    $inputs = $('#scrollbar:checked');

    if($inputs.length == 0) {
      scrollBarWidth = -15;
    };

    $frames.find('iframe').each(function(i, el){
      $(el).attr('width', parseInt($(el).attr('width')) + scrollBarWidth);
    });
  }); 

  // When the url textbox is used
  $('form').submit(function(){
    loadPage('' , $('#url input[type=text]').val());
    return false;
  });
  
  // When frame loads
  $('iframe').load(function(){
    let $this = $(this);
    let url = '';
    let error = false;

    try{
      url = $this.contents().get(0).location.href;
    } catch(e) {
      error = true;
      if($('#url input[type=text]').val() != '') {
        url = $('#url input[type=text]').val();
      } else {
        url = defaultURL;
      }
    }

    // Load other pages with the same URL
    if(allLoaded()) {
      if(error) {
        alert('Browsers prevent navigation from inside iframes across domains.\nPlease use the textbox at the top for external sites.');
        loadPage('', defaultURL);
      } else {
        loadPage($this, url);
      }
    } else { // When frame loads, hide loader graphic
      error = false;
      hideLoader($(this).parent().attr('id'));
      $(this).data('loaded',true);
    };
  });
})