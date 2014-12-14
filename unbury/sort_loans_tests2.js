$( document ).ready(function() {

	QUnit.test( "sort loan test 1", function( assert ) {
		var id = '0';
		var payment = 25;
		var current_interest = {'0' : 30, '1': 20};
		var current_principal = {'0' : 30, '1': 0};
		var remaining_loans = {'0' : new Loan(0,'asd', 30,5,6), '1' : new Loan(0,'asd', 30,5,5)};
		var payment_type = "snowball";
		var sorted_keys = sort_loans(remaining_loans,current_principal,current_interest,payment_type);
		assert.ok( arraysEqual(sorted_keys, ['1','0']), sorted_keys );

		var payment_type = "avalanche";
		var sorted_keys = sort_loans(remaining_loans,current_principal,current_interest,payment_type);
		assert.ok( arraysEqual(sorted_keys, ['0','1']), sorted_keys );

	});


	QUnit.test( "sort loan test 2", function( assert ) {
		var id = '0';
		var payment = 25;
		var current_interest = {'0' : 30, '1': 20};
		var current_principal = {'0' : 30, '1': 0};
		var remaining_loans = {'0' : new Loan(0,'asd', 30,5,5.1), '1' : new Loan(0,'asd', 30,5,5.7)};
		var payment_type = "snowball";
		var sorted_keys = sort_loans(remaining_loans,current_principal,current_interest,payment_type);
		assert.ok( arraysEqual(sorted_keys, ['1','0']), sorted_keys );

		payment_type = "avalanche";
		sorted_keys = sort_loans(remaining_loans,current_principal,current_interest,payment_type);
		assert.ok( arraysEqual(sorted_keys, ['1','0']), sorted_keys );

	});



});