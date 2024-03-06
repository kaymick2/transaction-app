
let dateInput= document.getElementById('date');
let whoTransactedInput=document.getElementById('whoTrans');
let payWhoInput=document.getElementById('payWho');
let amountInput=document.getElementById('transAmount');
let typeInput=document.getElementById('transType');
let payDateInput=document.getElementById('paid');
let linkInput=document.getElementById('forWhat');
let confInput=document.getElementById('confNum');
let transactionID = document.getElementById('transaction-id');
let dateEditInput = document.getElementById('date-edit');
let whoTransactedEditInput = document.getElementById('whoTrans-edit');
let payWhoEditInput = document.getElementById('payWho-edit');
let amountEditInput = document.getElementById('transAmount-edit');
let typeEditInput = document.getElementById('transType-edit');
let payDateEditInput = document.getElementById('paid-edit');
let linkEditInput = document.getElementById('forWhat-edit');
let confEditInput = document.getElementById('confNum-edit');
let transactions = document.getElementById('transactions');
let data = [];
let selectedTransaction = {};
const api = 'http://127.0.0.1:8000';

function tryAdd() {
  let msg = document.getElementById('msg');
  msg.innerHTML = '';
}

document.getElementById('form-add').addEventListener('submit', (e) => {
  e.preventDefault();

  if (!amountInput.value) {
    document.getElementById('msg').innerHTML = 'BLANK TRANSACTIONS MEANS TAX FRAUD';
  } else {
    addTransaction(dateInput.value, whoTransactedInput.value, payWhoInput.value, amountInput.value, typeInput.value, payDateInput.value, linkInput.value, confInput.value);

    // close modal
    let add = document.getElementById('add');
    add.setAttribute('data-bs-dismiss', 'modal');
    add.click();
    (() => {
      add.setAttribute('data-bs-dismiss', '');
    })();
  }
});

let addTransaction = (date, whoTrans, payWho, transAmount, transType, paid, forWhat, confNum) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 201) {
      const newTransaction = JSON.parse(xhr.responseText);
      data.push(newTransaction);

      refreshTransactions();
    }
  };
  xhr.open('POST', `${api}/transactions`, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({date, whoTrans, payWho, transAmount, transType, paid, forWhat, confNum}));
};

/**
 * Refreshes the transactions table by populating it with data from the 'data' array.
 */

var csvContent='';
let refreshTransactions = () => {

  csvContent=Papa.unparse(data);
  // Clear the existing content of the 'transactions' table
  transactions.innerHTML = '';
  const dates= data.map(z =>z.date)
    // Sort the transactions by ID in descending order
  data.sort((a, b) => a.date - b.date);

  // Iterate through each transaction and create a new row in the table
  data.map((x) => {
      // Create a new row in the table
      const row = transactions.insertRow();
      const link = `<a href="https://${x.forWhat}" target="_blank">LINK</a>`;

      // Populate the row with transaction data
      row.innerHTML += `
          <tr>
              <th scope='row'>${x.id}</th>
              <td>${x.date}</td>
              <td>${x.whoTrans}</td>
              <td>${x.payWho}</td>
              <td>$${x.transAmount}</td>
              <td>${x.transType}</td>
              <td>${x.paid}</td>
              <td>${link}</td>
              <td>${x.confNum}</td>
              <td>
                  <button
                      type="button"
                      class="btn-primary btn blue-rainbow-button"
                      data-bs-toggle="modal"
                      data-bs-target="#modal-edit"
                      onclick="tryEditTransaction(${x.id})"
                  >
                      Edit
                  </button>
              </td>
              <td>
                  <button
                      type="button"
                      class="btn-primary btn red-rainbow-button"
                      onclick="deleteTransaction(${x.id})"
                  >
                      Delete
                  </button>
              </td>
              <td>N/A</td>
          </tr>
      `;
  });

  // Reset the form input fields
  resetForm();
};
function externalRedirect(what){
  window.location.href=what;
}
let tryEditTransaction = (id) => {
  const transaction = data.find((x) => x.id === id);
  selectedTransaction = transaction;
  transactionID.innerText = transaction.id;
  dateEditInput.value=transaction.date;
  whoTransactedEditInput.value=transaction.whoTrans;
  payWhoEditInput.value=transaction.payWho;
  amountEditInput.value=transaction.transAmount;
  typeEditInput.value=transaction.transType;
  payDateEditInput.value=transaction.paid;
  linkEditInput.value=transaction.forWhat;
  confEditInput.value=transaction.confNum;
  document.getElementById('msg').innerHTML = '';
};

document.getElementById('form-edit').addEventListener('submit', (e) => {
  e.preventDefault();

  if (!typeEditInput.value) {
    msg.innerHTML = 'transaction type cannot be blank';
    /*IF THIS DOESNT WORK, JUST USE ALERT()!*/
  } else if (!amountEditInput.value){
    msg.innerHTML='Transaction amount cannot be blank';
  } else {
    editTransaction(dateEditInput.value, whoTransactedEditInput.value, payWhoEditInput.value, amountEditInput.value, typeEditInput.value, payDateEditInput.value, linkEditInput.value, confEditInput.value);

    // close modal
    let edit = document.getElementById('edit');
    edit.setAttribute('data-bs-dismiss', 'modal');
    edit.click();
    (() => {
      edit.setAttribute('data-bs-dismiss', '');
    })();
  }
});
let editTransaction = (date, whoTrans, payWho, transAmount, transType, paid, forWhat, confNum) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      selectedTransaction.date = date;
      selectedTransaction.whoTrans = whoTrans;
      selectedTransaction.payWho = payWho;
      selectedTransaction.transAmount = transAmount;
      selectedTransaction.transType = transType;
      selectedTransaction.paid = paid;
      selectedTransaction.forWhat = forWhat;
      selectedTransaction.confNum = confNum;
      refreshTransactions();
    }
  };
  xhr.open('PUT', `${api}/transactions/${selectedTransaction.id}`, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({date, whoTrans, payWho, transAmount, transType, paid, forWhat, confNum}));
};

let deleteTransaction = (id) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      data = data.filter((x) => x.id !== id);
      refreshTransactions();
    }
  };
  xhr.open('DELETE', `${api}/transactions/${id}`, true);
  xhr.send();
};

let resetForm = () => {
  dateInput.value = '';
  whoTransactedInput.value = '';
  payWhoInput.value = '';
  amountInput.value = '';
  typeInput.value = '';
  payDateInput.value = '';
  linkInput.value = '';
  confInput.value = '';


};


console.log(csvContent);
const exportButton = document.getElementById('exportbutton');
exportButton.addEventListener('click', () => {
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  // Create the button element
  const button = document.createElement('button');
  button.textContent = 'Download CSV'; // Set the button text
  button.classList.add('rainbow-button');
  button.onclick = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.csv';
    link.click();
  };
  
  // Insert the button at the top of the page (before any other content)
  const container = document.getElementById('titlebuttoncontainer'); // Replace with your actual container ID
  container.appendChild(button);
});
let getTransactions = () => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      data = JSON.parse(xhr.responseText) || [];
      refreshTransactions();
    }
  };
  xhr.open('GET', `${api}/transactions`, true);
  xhr.send();
};

(() => {
  getTransactions();
})();
