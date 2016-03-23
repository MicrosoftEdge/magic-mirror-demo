(function () {
  "use strict";
  var errors = {};

  function validateZipcode(input) {
    var re = new RegExp("^\\d{5}(-\\d{4})?$");
    return re.test(input);
  }
  function validateInputs() {
    errors = {};
    if (!$('[name=name]').val())
      errors.name = '<p>Please add your name.</p>';
    if (!$('[name=email]').val())
      errors.name = '<p>Please add your email.</p>';
    if (!validateZipcode($('[name=zipcode]').val()))
      errors.zipcode = '<p>Please fix your zipcode.</p>';
    if (!$('[name=homeAddress]').val())
      errors.name = '<p>Please add your home address.</p>';
    if (!$('[name=workAddress]').val())
      errors.name = '<p>Please add your work address.</p>';
    if (!$('[name=stock]').val())
      errors.stock = '<p>Please enter stock symbol.</p>';
    return _.isEmpty(errors);
  }
  // query Yahoo Finance for a list of stocks
  $("#stock").autocomplete({
    source: function (request, response) {
      var YAHOO = window.YAHOO = { util: { ScriptNodeDataSource: {} } };
      YAHOO.util.ScriptNodeDataSource.callbacks = function (data) {
        var mapped = $.map(data.ResultSet.Result, function (e, i) {
          return {
            label: e.symbol + ' (' + e.name + ')',
            value: e.symbol
          };
        });
        response(mapped);
      };
      var url = ["https://s.yimg.com/aq/autoc?query=" + request.term + "&region=CA&lang=en-CA&callback=YAHOO.util.ScriptNodeDataSource.callbacks"];
      $.getScript(url + "");
    },
    minLength: 1
  });
  function getErrors() {
    return _.values(errors);
  }
  $('form').on('submit', function (event) {
    if (!validateInputs()) {
      console.log(errors);
      $('#form-errors').html(getErrors()[0]);
      $('#form-errors').show();
    } else {
      $.ajax({
        url: '/create',
        type: 'POST',
        data: $('form').serialize(),
        success: function (body) {
          window.location.href = '/face/' + JSON.parse(body);
        }
      });
    }
    return false;
  });
})()
