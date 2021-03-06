import './App.css';
import Web3 from 'web3';
import { Component } from 'react';

let lotteryAddress = '0x1Ba96B2bF30417cF6277e2aBcB8b7f7709bBE599';
let lotteryABI = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "BET", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "DRAW", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "FAIL", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "REFUND", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "WIN", "type": "event" }, { "constant": true, "inputs": [], "name": "answerForTest", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address payable", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getSomeValue", "outputs": [ { "internalType": "uint256", "name": "value", "type": "uint256" } ], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [], "name": "getPot", "outputs": [ { "internalType": "uint256", "name": "pot", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "betAndDistribute", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "bet", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "distribute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "setAnswerForTest", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "isMatch", "outputs": [ { "internalType": "enum Lottery.BettingResult", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "getBetInfo", "outputs": [ { "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" }, { "internalType": "address", "name": "bettor", "type": "address" }, { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "payable": false, "stateMutability": "view", "type": "function" } ]
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      betRecords: [],
      winRecords: [],
      failRecords: [],
      pot: '0',
      challenges: ['A', 'B'],
      finalRecords: [{
        bettor:'0xabcd...',
        index:'0',
        challenges:'ab',
        answer:'ab',
        targetBlockNumber:'10',
        pot:'0'
      }]
    }
  }
  async componentDidMount() {
    await this.initWeb3();
    // await this.polData();
    setInterval(this.polData, 1000);
  }

  polData = async () => {
    await this.getPot();
    await this.getBetEvents();
    await this.getWinEvents();
    await this.getFailEvents();
    this.makeFinalRecords();
  };

  initWeb3 = async () => {

      if (window.ethereum) {
        console.log('Recent mode')
        this.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed 
            await window.ethereum.enable();
            // Acccounts now exposed
            // this.web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
            console.log(`User denied account access error : ${error}`);    
          }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        console.log('legacy mode')
        this.web3 = new Web3(Web3.currentProvider);
        // Acccounts always exposed
        // web3.eth.sendTransaction({/* ... */});
      }
      // Non-dapp browsers...
      else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }

      let accounts = await this.web3.eth.getAccounts();
      this.accounts = accounts[0];

      this.lotteryContract = new this.web3.eth.Contract(lotteryABI, lotteryAddress);

    }

  getPot = async () => {
    let pot = await this.lotteryContract.methods.getPot().call();
    let potString = this.web3.utils.fromWei(pot.toString(), 'ether');
    this.setState({pot:potString});
  }

  makeFinalRecords = () => {

    let f = 0, w = 0;
    const records = [...this.state.betRecords];
    for(let i=0; i<this.state.betRecords.length; i++) {
      if(this.state.winRecords.length > 0 && this.state.betRecords[i].index === this.state.winRecords[w].index){
        records[i].win = 'WIN';
        records[i].answer = records[i].challenges;
        records[i].pot = this.web3.utils.isBN(this.state.winRecords[w].amount, 'ether');
        if(this.state.winRecords.length - 1 > w) w++;

      } else if(this.state.failRecords.length > 0 && this.state.betRecords[i].index === this.state.failRecords[f].index){
        records[i].win = 'FAIL';
        records[i].answer = this.state.failRecords[f].answer;
        records[i].pot = 0;
        if(this.state.failRecords.length - 1 > f) f++;
      } else {
        records[i].answer = 'Not Revealed';
      }
    }

    this.setState({finalRecords:records})
  }
  
  getBetEvents = async () => {
    const records = [];
    let events = await this.lotteryContract.getPastEvents('BET', {fromBlock:0, toBlock:'latest'});
    for(let i=0; i<events.length; i+=1) {
      const record = {}
      record.index = parseInt(events[i].returnValues.index, 10).toString();
      record.bettor = events[i].returnValues.bettor.slice(0,4) + '...' + events[i].returnValues.bettor.slice(40,42);
      record.betBlockNumber = events[i].blockNumber;
      record.targetBlockNumber = events[i].returnValues.answerBlockNumber.toString();
      record.challenges = events[i].returnValues.challenges;
      record.win = 'Not Revealed';
      record.answer = '0x00';
      records.unshift(record);
    }
    this.setState({betRecords:records})
  }

  getFailEvents = async () => {
    const records = [];
    let events = await this.lotteryContract.getPastEvents('FAIL', {fromBlock:0, toBlock:'latest'});
    for(let i=0; i<events.length; i+=1) {
      const record = {}
      record.index = parseInt(events[i].returnValues.index, 10).toString();
      record.answer = events[i].returnValues.answer;
      records.unshift(record);
    }
    console.log(records);
    this.setState({winRecords:records})
  }
  
  getWinEvents = async () => {
    const records = [];
    let events = await this.lotteryContract.getPastEvents('WIN', {fromBlock:0, toBlock:'latest'});
    for(let i=0; i<events.length; i+=1) {
      const record = {}
      record.index = parseInt(events[i].returnValues.index, 10).toString();
      record.amount = parseInt(events[i].returnValues.amount, 10).toString();
      records.unshift(record);
    }
    this.setState({winRecords:records})
  }

  bet = async () => {
    //nonce
    let challenges = '0x' + this.state.challenges[0].toLowerCase() + this.state.challenges[1].toLowerCase();
    let nonce = await this.web3.eth.getTransactionCount(this.accounts);
    this.lotteryContract.methods.betAndDistribute(challenges).send({from:this.accounts, value:5000000000000000, gas:300000, nonce:nonce})
    .on('transactionHash', (hash) => {
      console.log(hash)
    })
  }
  onClickCard = (_Character) => {
    this.setState({
      challenges : [this.state.challenges[1], _Character]
    })
  }
  gerCard = (_Character, _cardStyle) => {

    let _card = '';
    if(_Character === 'A') {
      _card = '????';
    }
    if(_Character === 'B') {
      _card = '????';
    }
    if(_Character === 'C') {
      _card = '????';
    }
    if(_Character === '0') {
      _card = '????';
    }
    return (
      <button className={_cardStyle} onClick = {() => {
        this.onClickCard(_Character)
      }}>
        <div className="card-body text-center">
          <p className="card-text"></p>
          <p className="card-text text-center" style = {{fontSize:300}}>{_card}</p>
          <p className="card-text"></p>
        </div>
      </button>  
    )
  }
  render() {
    return (
      <div className="App">

        {/* Header - Pot, Betting charactors */}
        <div className="container">
          <div className="jumbotron">
            <h1>Current Pot : {this.state.pot}</h1>
            <p>Lottery</p>
            <p>Lottery tutorial</p>
            <p>Your Bet</p>
            <p>{this.state.challenges[0]} {this.state.challenges[1]}</p>
          </div>
        </div>

        {/* Card section*/}
        <div className="container">
          <div className="card-group">
            {this.gerCard('A', 'card bg-primary')}
            {this.gerCard('B', 'card bg-warning')}
            {this.gerCard('C', 'card bg-danger')}
            {this.gerCard('0', 'card bg-success')}
          </div>  
        </div> 
        <br></br>
        <div className="container">
          <button className="btn btn-danger btn-lg" onClick = {this.bet}>BET!</button>
        </div>
        <br></br>
        <div className="container">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>Index</th>
                <th>Address</th>
                <th>Challenge</th>
                <th>Answer</th>
                <th>Pot</th>
                <th>Status</th>
                <th>AnswerBlockNumber</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.finalRecords.map((record, index) => {
                  return (
                    <tr key={index}>
                      <td>{record.index}</td>
                      <td>{record.bettor}</td>
                      <td>{record.challenges}</td>
                      <td>{record.answer}</td>
                      <td>{record.pot}</td>
                      <td>{record.win}</td>
                      <td>{record.targetBlockNumber}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
