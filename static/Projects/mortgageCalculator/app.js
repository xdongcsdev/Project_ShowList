// Listen for calculate submit
document.getElementById('loan-form').addEventListener('submit', function(e){
  // Hide results
  document.getElementById('results').style.display = 'none';
  
  // Show loader
  document.getElementById('loading').style.display = 'block';

  //time to see the result
  setTimeout(calculateResults, 50);

  e.preventDefault();
})
//listen for view Amortization

document.getElementById('loadTable').addEventListener('submit', function(e){

  // show result
  document.getElementById('amtTable').style.display = 'block';
  // Show loader

  e.preventDefault();
})

// Calculate Results
function calculateResults(){
  console.log('Calculating...');
  // UI Vars
  const amount = document.getElementById('amount');
  const interest = document.getElementById('interest');
  const years = document.getElementById('years');
  const monthlyPayment = document.getElementById('monthly-payment');
  const totalPayment = document.getElementById('total-payment');
  const totalInterest = document.getElementById('total-interest');

  const principal = parseFloat(amount.value);
  const calculatedInterest = parseFloat(interest.value) / 100 / 12;
  const calculatedPayments = parseFloat(years.value) * 12;

  // Compute monthly payment
  const x = Math.pow(1 + calculatedInterest, calculatedPayments);
  //calculate monthly payment
  const monthly = (principal*x*calculatedInterest)/(x-1);

  if(isFinite(monthly)) {
    monthlyPayment.value = monthly.toFixed(2);
    totalPayment.value = (monthly * calculatedPayments).toFixed(2);
    totalInterest.value = ((monthly * calculatedPayments)-principal).toFixed(2);

    // Show results
    document.getElementById('results').style.display = 'block';

    // Hide loader
    document.getElementById('loading').style.display = 'none';

  } else {
    showError('Please check your numbers');
  }

  //delete tbody[0]
  var parent = document.getElementsByTagName('tbody')[0];
  while (parent.hasChildNodes()){
    parent.removeChild(parent.firstChild);
  }

  
  displayMonthly(calculatedInterest, years, monthly, principal);
}

//display monthly table list
function displayMonthly(interest, years, monthlyPayment, principal){
  console.log('displaymontly...');
  //delete old row if exist

  //get start from tbody[0], if there is another tbody, then tbody[1]
  tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];

  var newRow, newCell, newText;

  var MonthlyInterest = interest;

  var term = years.value *12;

  var balance = principal;

  var payment = monthlyPayment;
 
  console.log(MonthlyInterest);
  console.log(term);
  console.log(balance);
  console.log(payment);

  for(var i=1; i<term+1; i++){  
  //in loop interest amount holder
    var interest = 0; 
  //in loop monthly principle amount holder
    var monthlyPrincipal = 0;
  // Insert a row in the table at the last row
    var num = 0;
    newRow   = tableRef.insertRow(tableRef.rows.length);

  // Insert a cell in the row at index 1 - Month
    newCell = newRow.insertCell(num++);
    newText = document.createTextNode(i);
    newCell.appendChild(newText);

    // Insert a cell in the row at index 2 - Monthly interest
    newCell = newRow.insertCell(num++);
    //calculate monthly interest payment
    interest = balance * MonthlyInterest;
    newText = document.createTextNode('$' + interest.toFixed(2));
    newCell.appendChild(newText);

    
    // Insert a cell in the row at index 3 - Monthly Principle
    newCell = newRow.insertCell(num++);
    //calculate monthly principal
    monthlyPrincipal = payment - interest;
    newText = document.createTextNode('$' + monthlyPrincipal.toFixed(2));
    newCell.appendChild(newText);

    // Insert a cell in the row at index 4 - Montly Payment
    newCell = newRow.insertCell(num++);
    if(payment>balance) payment = balance;

    newText = document.createTextNode('$' + payment.toFixed(2));
    newCell.appendChild(newText);

    // Insert a cell in the row at index 5 - remain Balance
    newCell = newRow.insertCell(num++);
    // calculate remain balance
    balance = balance - monthlyPrincipal;
    
    if(balance < 0) balance = 0;
    newText = document.createTextNode('$' + balance.toFixed(2));
    newCell.appendChild(newText);


  //note
  //https://codepen.io/joeymack47/pen/fHwvd
 
  }//end of for loop
}//end of displayMonthly


// Show Error
function showError(error){
  // Hide results
  document.getElementById('results').style.display = 'none';
  
  // Hide loader
  document.getElementById('loading').style.display = 'none';

  // Create a div
  const errorDiv = document.createElement('div');

  // Get elements
  const card = document.querySelector('.card');
  const heading = document.querySelector('.heading');

  // Add class
  errorDiv.className = 'alert alert-danger';

  // Create text node and append to div
  errorDiv.appendChild(document.createTextNode(error));

  // Insert error above heading
  card.insertBefore(errorDiv, heading);

  // Clear error after 3 seconds
  setTimeout(clearError, 3000);
}

// Clear error
function clearError(){
  document.querySelector('.alert').remove();
}