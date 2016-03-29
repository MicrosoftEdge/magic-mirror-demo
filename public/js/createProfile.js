(function() {
  'use strict';

  var errors = {};

  function validateZipcode(input) {
    return /^\d{5}(-\d{4})?$/.test(input);
  }

  function validateInputs() {
    errors = {};
    if (!$('[name=name]').val()) {
      errors.name = '<p>Please add your name.</p>';
    }
    if (!$('[name=email]').val()) {
      errors.name = '<p>Please add your email.</p>';
    }
    if (!validateZipcode($('[name=zipcode]').val())) {
      errors.zipcode = '<p>Please fix your zipcode.</p>';
    }
    if (!$('[name=homeAddress]').val()) {
      errors.name = '<p>Please add your home address.</p>';
    }
    if (!$('[name=workAddress]').val()) {
      errors.name = '<p>Please add your work address.</p>';
    }
    if (!$('[name=stock]').val()) {
      errors.stock = '<p>Please enter stock symbol.</p>';
    }
    if (!$('[name=agree-terms]').prop('checked')) {
      errors.stock = '<p>Please accept the terms and conditions.</p>';
    }
    return _.isEmpty(errors);
  }
  // Query Yahoo Finance for a list of stocks.
  $('#stock').autocomplete({
    'source': function(request, response) {
        var url = '/mirror/getStockSymbols?term=' + request.term;
        $.ajax({
            'url': url,       
            'success': function(data) {
                console.log('data: ', data);  
                JSON.stringify(data);                  
                var mapped = $.map(data.ResultSet.Result, function(e, i) {
                    return {
                        'label': e.symbol + ' (' + e.name + ')',
                        'value': e.symbol
                    };
                });
                response(mapped);
            }
       }); 
    },
    'minLength': 1
  });

  function getErrors() {
    return _.values(errors);
  }

  $('form').on('submit', function(event) {
    if (!validateInputs()) {
      console.log(errors);
      $('#form-errors').html(getErrors()[0]);
      $('#form-errors').show();
    }
    else {
      $.ajax({
        'url': '/create',
        'type': 'POST',
        'data': $('form').serialize(),
        'success': function(body) {
          location.href = '/face/' + JSON.parse(body);
        }
      });
    }
    return false;
  });
}());
