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
        return _.values(errors).length == 0       
    }
    function getErrors() {
        return _.values(errors)
    }
    $('form').on('submit', function(event){
        if(!validateInputs()){   
            console.log(errors)
           $('#error').html(getErrors()[0]) 
           return false
       }
    })
})()