const SHA256 = require('crypto-js/sha256');

class Data {
    constructor(amount, owner) {
        this.amount = amount;
        this.owner = owner;
    }
}

class Block {
    constructor(index, amount, owner, previousHash = null) {
        this.index = index;
        this.timestamp = this.getTimestamp();
        this.data = new Data(amount, owner);
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    twoPad(str) {
        return str.toString().padStart(2, 0);
    }

    getTimestamp() {
        let date = new Date();
        return date.getUTCFullYear() + '-' + this.twoPad(date.getUTCMonth()) + '-' + this.twoPad(date.getUTCDate()) + ' ' + this.twoPad(date.getUTCHours()) + ':' + this.twoPad(date.getUTCMinutes()) + ':' + this.twoPad(date.getUTCSeconds());
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash).toString();
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, 100, 'alee');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(amount, owner) {
        let block = new Block(this.chain.length, amount, owner, this.getLatestBlock().hash);

        this.chain.push(block);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let blockChain = new BlockChain();

blockChain.addBlock(200, 'arslan');
blockChain.addBlock(300, 'mateen');
blockChain.addBlock(400, 'usman');

console.log(JSON.stringify(blockChain, null, 4));
console.log('is chain valid?', blockChain.isChainValid());

blockChain.chain[2].data = new Data(10000, 'hacker');

console.log(JSON.stringify(blockChain, null, 4));
console.log('is chain valid?', blockChain.isChainValid());