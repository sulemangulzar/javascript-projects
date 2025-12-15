
const balance = document.getElementById('balance');
const money_plus = document.getElementById('income-display');
const money_minus = document.getElementById('expense-display');
const list = document.getElementById('list');
const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const incText = document.getElementById('inc-text');
const incAmount = document.getElementById('inc-amount');
const incCategory = document.getElementById('inc-category');
const expText = document.getElementById('exp-text');
const expAmount = document.getElementById('exp-amount');
const expCategory = document.getElementById('exp-category');
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];


function generateID() {
  return Math.floor(Math.random() * 100000000);
}


function addIncome(e) {
  e.preventDefault();

  if (incText.value.trim() === '' || incAmount.value.trim() === '') {
    alert('Please add a description and amount');
    return;
  }

  const transaction = {
    id: generateID(),
    text: incText.value,
    amount: +incAmount.value,
    category: incCategory.value,
    type: 'income',
    date: new Date().toLocaleDateString()
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  incText.value = '';
  incAmount.value = '';
}


function addExpense(e) {
  e.preventDefault();

  if (expText.value.trim() === '' || expAmount.value.trim() === '') {
    alert('Please add a description and amount');
    return;
  }


  const transaction = {
    id: generateID(),
    text: expText.value,
    amount: -expAmount.value,
    category: expCategory.value,
    type: 'expense',
    date: new Date().toLocaleDateString()
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  expText.value = '';
  expAmount.value = '';
}


function addTransactionDOM(transaction) {

  const sign = transaction.amount < 0 ? '-' : '+';

  const borderClass = transaction.amount < 0 ? 'to-red-50 hover:border-red-200' : 'to-green-50 hover:border-green-200';
  const textClass = transaction.amount < 0 ? 'text-red-600' : 'text-green-600';
  const iconColor = transaction.amount < 0 ? 'from-red-400 to-red-600' : 'from-green-400 to-green-600';
  

  const item = document.createElement('div');
  

  item.className = `expense-item p-4 md:p-5 bg-gradient-to-r from-white ${borderClass} rounded-2xl cursor-pointer border-2 border-transparent relative group`;

  item.innerHTML = `
    <div class="flex items-center justify-between">
        <div class="flex items-center flex-1 min-w-0">
            <div class="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br ${iconColor} rounded-2xl flex-shrink-0 flex items-center justify-center mr-3 md:mr-4 shadow-lg">
                <span class="text-white text-xl font-bold">${transaction.category.charAt(0)}</span>
            </div>
            <div class="min-w-0 truncate pr-2">
                <h4 class="font-bold text-gray-800 text-sm md:text-lg truncate">${transaction.text}</h4>
                <p class="text-xs md:text-sm text-gray-500 flex items-center mt-1 truncate">
                    <span class="mr-2 truncate">${transaction.category}</span> 
                    <span class="hidden sm:inline"> • ${transaction.date}</span>
                </p>
            </div>
        </div>
        <div class="flex flex-col items-end">
            <span class="${textClass} font-bold text-base md:text-xl flex-shrink-0">${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
        </div>
        <button class="delete-btn absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md hover:bg-red-600" onclick="removeTransaction(${transaction.id})">
            ✕
        </button>
    </div>
  `;

  list.appendChild(item);
}


function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);


  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);


  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);


  balance.innerText = `$${total}`;
  money_plus.innerText = `+$${income}`;
  money_minus.innerText = `-$${expense}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}


function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

incomeForm.addEventListener('submit', addIncome);
expenseForm.addEventListener('submit', addExpense);


init();