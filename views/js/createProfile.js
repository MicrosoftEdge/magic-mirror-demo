(function () {
    "use strict";
    var errors = {}
    function validateZipcode(input) {
        var re = new RegExp("^\\d{5}(-\\d{4})?$")
        return re.test(input)
    }
    function validateInputs() {
        errors = {}
        if(!$('[name=name]').val())
            errors.name = 'Please add your name.'
        if(!$('[name=email]').val())
            errors.name = 'Please add your email.'
        if(!validateZipcode($('[name=zipcode]').val()))
            errors.zipcode = 'Please fix your zipcode.'
        return _.isEmpty(errors)       
    }    
    // query Yahoo Fiance for a list of stocks
    $("#stock").autocomplete({
      source: function (request, response) {  
          var YAHOO = window.YAHOO = {util: {ScriptNodeDataSource: {}}};        
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
          $.getScript(url +"");
      },
        minLength: 2
    });
    function getErrors() {
        return _.values(errors)
    }
    $('form').on('submit', function(event){
        if(!validateInputs()){   
            console.log(errors)
           $('#error').html(getErrors()[0]) 
       } else {
         $.ajax({
          url: '/create',
          type: 'POST',
          data : $('form').serialize(),
          success: function(body){
            console.log('/capture/' + JSON.parse(body))
            window.location.href = '/capture/' + JSON.parse(body)
          }
        })
       }
      return false;
    })
})()