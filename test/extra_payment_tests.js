$( document ).ready(function() {

  QUnit.test( "extra payment test 1", function( assert ) {
    var id = '0';
    var payment = 25;
    var interest_dict = {'0' : 30};
    var principal_dict = {'0' : 30};
    apply_payment(id, payment, interest_dict, principal_dict);
    assert.ok( interest_dict['0'] == 5, "Passed!" );

  });
});