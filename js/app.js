typeof web3 !== 'undefined'
  ? (web3 = new Web3(web3.currentProvider))
  : (web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')));

if (web3.isConnected()) {
  console.log('connected');
} else {
  console.log('not connected');
  exit;
}

const contractAddress = '0x15096b22d63fbe036a313ace5b125e7feab84bd7';
const smartContract = web3.eth.contract(abi).at(contractAddress);
let block_numbers = [];

function init() {
  // 첫번째 계정으로 주소 설정
  document.getElementById('account').value = web3.eth.accounts[0];
  // 비밀번호 입력
  document.getElementById('pass').value = 'eth';
}

let watching = false;

function showList() {
  const table = document.getElementById('table1');
  //const length = smartContract.getNumOfProducts();
  const length = smartContract.getTotal();

  smartContract.product().watch((err, res) => {
    if (!err) {
      console.dir(res);
      if(block_numbers.indexOf(res.blockNumber.toString()) > -1){
        return;
      }
      const row = table.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      // cell1.innerHTML = res.args.number.c[0];
      cell1.innerHTML = res.args.id.c[0];
      cell2.innerHTML = res.args.productName;
      cell3.innerHTML = res.args.location;
      cell4.style.width = '60%';
      cell4.innerHTML = new Date(res.args.timestamp.c[0] * 1000);
      
    }
  });

  for (let i = 0; i < length; i++) {
    //smartContract.getProductStruct(i);
    const product = smartContract.getProduct(i);
    const toString = product.toString();
    const strArray = toString.split(',');

    const timestamp = new Date(strArray[3] * 1000);
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    cell1.innerHTML = strArray[0];
    cell2.innerHTML = strArray[1];
    cell3.innerHTML = strArray[2];
    cell4.style.width = '60%';
    cell4.innerHTML = timestamp;
    console.log(product);
    if(block_numbers.indexOf(strArray[4]) == -1){
      block_numbers.push(strArray[4]);
    }
  }
}

function addProduct() {
  const pronumber = document.getElementById('pronumber').value;
  const proname = document.getElementById('proname').value;
  const proloc = document.getElementById('proloc').value;
  const account = document.getElementById('account').value;
  if (
    web3.personal.unlockAccount(account, document.getElementById('pass').value)
  ) {
    //smartContract.addProStru
    smartContract.addProduct(
      pronumber,
      proname,
      proloc,
      { from: account, gas: 2000000 },
      (err, result) => {
        if (!err) alert('트랜잭션이 성공적으로 전송되었습니다.\n' + result);
      }
    );
  }
}

$(function() {
  init();
  showList();
});
