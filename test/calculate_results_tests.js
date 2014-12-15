$( document ).ready(function() {

	QUnit.test( "calculate test 1", function( assert ) {

        loan_results = {};
		var loans = {'0' : new Loan(0,'asd', 30,5,6), '1' : new Loan(0,'asd', 30,5,5)};
		var payment_type = "avalanche";
		var monthly_payment = 20;
		var results = calculate(loans, payment_type, monthly_payment);
        assert.ok( 5== 4, results.toSource()  );
        document.getElementById("json").innerHTML = JSON.stringify(results, undefined, 2);



	});






});