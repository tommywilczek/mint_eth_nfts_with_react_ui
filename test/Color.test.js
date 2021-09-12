const Color = artifacts.require('./EthereumColors.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('EthereumColors', (accounts) => {
    let contract;

    beforeEach(async() => {
        contract = await EthereumColors.deployed();
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
            let expectedColors = ['#FFFFFF', '#150050', '#000000', '#4A0E4E'];
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

    describe('mint modifier', async() => {
        it('cannot mint something that is not a hex color', async() => {
            await contract.mint('').should.be.rejected;
            
            // Too short
            await contract.mint('#FFF').should.be.rejected;
            
            // Too long
            await contract.mint('#FFFFFFF').should.be.rejected;
            
            // no #, correct length
            await contract.mint('FFFFFFF').should.be.rejected;
            
            // color should be hex
            await contract.mint('#ZZZZZZ').should.be.rejected;
            
        });
    });

    describe('metadata', async() => {
        const mangoColor = '#F4D19B';
        const imageUriForMangoColor = 'data:image/svg+xml;base64,IDxzdmcgeG1sbnM9Imh0dHA6Ly93d3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBzdHlsZT0iZmlsbDojRjREMTlCIiAvPjwvc3ZnPg';
        it('should convert a hex color into an svg image URI', async() => {
            const uri = await contract.colorToImageUri(mangoColor);
            console.log('uri :>> ', uri);
            assert.equal(uri, imageUriForMangoColor);
        });

        it('should format token URI', async() => {
            const tokenUri = await contract.formatTokenUri(mangoColor, imageUriForMangoColor);
            console.log('tokenUri :>> ', tokenUri);
        });

        it('should get metadata from color', async() => {
            const randColor = '#150050';
            // #150050 is the third color minted
            const tokenId = await contract.getTokenIdForColor(randColor).then(bigNum => bigNum.toNumber());
            console.log('tokenId :>> ', tokenId);

            const uri = await contract.tokenURI(tokenId);
            console.log('uri :>> ', uri);

            const metadata = await contract.getMetadataForColor(randColor);
            console.log('metadata :>> ', metadata);
        });
    });
})