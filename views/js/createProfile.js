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