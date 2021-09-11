import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Color from '../abis/Color.json';
import { ethers, Contract } from 'ethers';

class App extends Component {

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    this.setState({ provider });

  }

  async loadBlockchainData() {
    console.log('this.state.provider :>> ', this.state.provider);
    await this.state.provider.send("eth_requestAccounts", []);
    const signer = this.state.provider.getSigner();
    const account = await signer.getAddress();
    this.setState({ account });

    const balance = await this.state.provider.getBalance(account);
    const formattedBalance = ethers.utils.formatEther(balance);
    this.setState({ balance: formattedBalance });

    const networkData = Color.networks[window.ethereum.networkVersion];
    if (networkData) {
      const colorContract = new Contract(
        networkData.address,
        Color.abi,
        signer
      )
      this.setState({ colorContract });
      console.log('this.state.colorContract :>> ', this.state.colorContract);
      
      const totalSupply = await colorContract.totalSupply().then(bigNum => bigNum.toNumber());
      this.setState({ totalSupply });
      console.log('this.state.totalSupply :>> ', this.state.totalSupply);
      
      for (let i = 0; i < totalSupply; i++) {
        let c = await colorContract.colors(i);
        this.setState({
          colors: [... this.state.colors, c]
        })
      }

      console.log('this.state.colors :>> ', this.state.colors);

    } else {
      window.alert('We have detected you switched networks. Please switch to the Ethereum Mainnet.')
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      provider: undefined,
      account: undefined,
      balance: undefined,
      colorContract: undefined,
      totalSupply: 0,
      colors: []
    };
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <img src={logo} className="App-logo" alt="logo" />
            </li>
          </ul>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">Account: {this.state.account}</span></small>
              <hr />
              <small className="text-white"><span id="balance">Balance: {this.state.balance}</span></small>
            </li>
          </ul>
        </nav>
        {/* Hacky formatting... */}
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {/* FORM GOES HERE */}
              </div>
            </main>
          </div>
          <hr />
          <div className="row text-center">
            <p>Tokens go here...</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
