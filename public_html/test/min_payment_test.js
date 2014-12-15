$( document ).ready(function() {

  QUnit.test( "apply payment test 1", function( assert ) {
    var id = '0';
    var payment = 25;
    var interest_dict = {'0' : 30};
    var principal_dict = {'0' : 30};
    apply_payment(id, payment, interest_dict, principal_dict);
    assert.ok( interest_dict['0'] == 5, "Passed!" );

    payment = 35;
    interest_dict = {'0' : 30};
    apply_payment(id, payment, interest_dict, principal_dict);
    assert.ok( principal_dict[0] == 25, principal_dict[0] );
  });

  QUnit.test( "min payment test 1", function( assert ) {
    var expected_val = 0;
      var id = '0';
    var remaining_loans = {'0' : new Loan(0,'asd', 30,5,5)};
    var interest_dict = {'0' : 0};
    var principal_dict = {'0' : 30};
    var minimum_payments = {'0' : 30}
    pay_minimums(remaining_loans,principal_dict,interest_dict,minimum_payments);
    assert.ok( minimum_payments['0'] == expected_val, "Passed!" );

  });

  QUnit.test( "min payment test 1", function( assert ) {
    var expected_val = 5;
      var id = '0';
    var remaining_loans = {'0' : new Loan(0,'asd', 30,5,5)};
    var interest_dict = {'0' : 0};
    var principal_dict = {'0' : 25};
    var minimum_payments = {'0' : 30}
    pay_minimums(remaining_loans,principal_dict,interest_dict,minimum_payments);
    assert.ok( minimum_payments['0'] == expected_val, "Passed!" );

  });

  QUnit.test( "min payment test 1", function( assert ) {
    var expected_val = 5;
    var id = '0';
    var remaining_loans = {'0' : new Loan(0,'asd', 30,5,5)};
    var interest_dict = {'0' : 5};
    var principal_dict = {'0' : 20};
    var minimum_payments = {'0' : 30};
    pay_minimums(remaining_loans,principal_dict,interest_dict,minimum_payments);
    assert.ok( minimum_payments['0'] == expected_val, "Passed!" );
    assert.ok( interest_dict['0'] == 0, "Passed!" );
    assert.ok( principal_dict['0'] == 0, "Passed!" );

  });



});