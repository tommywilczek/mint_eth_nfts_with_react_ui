const Color = artifacts.require('./Color.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Color', (accounts) => {
    let contract;

    beforeEach(async() => {
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

    describe('minting', async() => {
        
        it('creates a new token successfully', async() => {
            const colorValue = '#FFFFFF';
            const result = await contract.mint(colorValue);
            const totalSupply = await contract.totalSupply();
            const event = result.logs[0].args
            
            // Success
            assert.equal(totalSupply, 1);
            assert.equal(event.tokenId.toNumber(), 1, 'id is correct');
            assert.equal(event.from, 0x0000000000000000000000000000000000000000, '`from` is correct');
            assert.equal(event.to, accounts[0], '`to` is correct');

            // Failure: fails when minting the same color twice
            await contract.mint(colorValue).should.be.rejected;
        });
    });

    describe('indexing', async() => {
        it('lists colors', async() => {
            // including color previously minted
            let expectedColors = ['#FFFFFF', '150050', '#000000', '#4A0E4E'];
            // Mint 3 MORE tokens
            await contract.mint(expectedColors[1]);
            await contract.mint(expectedColors[2]);
            await contract.mint(expectedColors[3]);
            const totalSupply = await contract.totalSupply();

            let result = []

            for (let i = 0; i < totalSupply; i++) {
                let color = await contract.colors(i);
                result.push(color);
            }

            assert.equal(result[0], '#FFFFFF'); // from first minting test
            assert.equal(result[1], expectedColors[1]);
            assert.equal(result[2], expectedColors[2]);
            assert.equal(result[3], expectedColors[3]);
        });
    });
})