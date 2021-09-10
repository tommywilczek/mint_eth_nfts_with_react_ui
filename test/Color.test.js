const Color = artifacts.require('./Color.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Color', (accounts) => {
    let contract;

    before(async() => {
        contract = await Color.deployed();
    });

    describe('deployment', async() => {
        it('deploys successfully', async() => {
            const address = contract.address;
            expect(address).to.not.eql(0x0);
            expect(address).to.not.be.empty;
            expect(address).to.not.be.null;
            expect(address).to.not.be.undefined;
        })

        it('has a name', async() => {
            const name = await contract.name();
            expect(name).to.eql('Color');
        });

        it('has a symbol', async() => {
            const symbol = await contract.symbol();
            expect(symbol).to.eql('COLOR');
        });
    })
})