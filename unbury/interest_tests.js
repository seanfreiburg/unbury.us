$( document ).ready(function() {

	QUnit.test( "apply payment test", function( assert ) {
        var id = '0';
		var payment = 25;
		var interest_dict = {'0' : 30};
		var principal_dict = {'0' : 30};
        loan_results["0"] = [{}];
		apply_payment(id, payment, interest_dict, principal_dict);
		assert.ok( interest_dict['0'] == 5, "Passed!" );

		payment = 35;
		interest_dict = {'0' : 30};
		apply_payment(id, payment, interest_dict, principal_dict);
		assert.ok( principal_dict[0] == 25, principal_dict[0] );
	});

	QUnit.test( "add interest test 1", function( assert ) {
		var expected_value = 30.25;
		var remaining_loans = {'0' : new Loan(0,'asd', 30,5,5)};
		var principal_dict = {'0' : 30};
		var interest_dict = {'0' : 30};
		add_interest(remaining_loans,principal_dict,interest_dict);
		assert.ok( interest_dict['0'] == expected_value, interest_dict['0']+" "+ expected_value );

	});

	QUnit.test( "add interest test 2", function( assert ) {
		var expected_value = .13;
		var remaining_loans = {'0' : new Loan(0,'asd', 30,5,5)};
		var principal_dict = {'0' : 30};
		var interest_dict = {'0' : 0};
		add_interest(remaining_loans,principal_dict,interest_dict);
		assert.ok( interest_dict['0'] == expected_value, interest_dict['0']+" "+ expected_value );

	});
	QUnit.test( "add interest test 3", function( assert ) {
		var expected_value_1 = .13;
		var expected_value_2 = 30.25;
		var expected_value_3 = 0;
		var remaining_loans = {'0' : new Loan(0,'asd', 30,5,5), '1' : new Loan(0,'asd', 30,5,5), '2' : new Loan(0,'asd', 30,5,0)};
		var principal_dict = {'0' : 30 ,'1': 30,'2': 30};
		var interest_dict = {'0' : 0,'1': 30,'2': 0};
		add_interest(remaining_loans,principal_dict,interest_dict);
		assert.ok( interest_dict['0'] == expected_value_1, interest_dict['0']+" "+ expected_value_1 );
		assert.ok( interest_dict['1'] == expected_value_2, interest_dict['1']+" "+ expected_value_2 );
		assert.ok( interest_dict['2'] == expected_value_3, interest_dict['2']+" "+ expected_value_3 );
	});



});