import { throws } from "assert";
import * as CryptoJS from "crypto-js";

class Block {
    public index:number;
    public hash:string;
    public previousHash:string;
    public data: string;
    public timestamp: number;

    //static method : 블록을 생성하지 않아도 사용가능한 메소드 .
    static calculateBlockHash = (index:number, previousHash:string, timestamp : number, data:string)
    : string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString(); 
    
    // 구조가 맞으면 True, 틀리면 False
    static validateStructure = (aBlock : Block) : boolean => 
    typeof aBlock.index === "number" && 
    typeof aBlock.hash === "string" && 
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";

    constructor(index:number, hash:string, previousHash:string, data:string, timestamp:number) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    };
}

const genesisBlock:Block = new Block(0,"4323432","","Hello",123456);

//check to push only Block in blockchain
let blockChain: Block[] = [genesisBlock];

const getBlockchain = () : Block[] => blockChain;

const getLatestBlock = () : Block => blockChain[blockChain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data:string) : Block => {
    const previousBlock : Block = getLatestBlock();
    const newIndex : number = previousBlock.index + 1;
    const newTimestamp : number = getNewTimeStamp();
    const newHash : string = Block.calculateBlockHash(
        newIndex,
        previousBlock.hash,
        newTimestamp,
        data
    );

    const newBlock : Block = new Block(
        newIndex, 
        newHash,
        previousBlock.hash,
        data,
        newTimestamp
    );
    addBlock(newBlock);
    return newBlock;
};

const getHashForBlock = (aBlock: Block) :string => Block.calculateBlockHash(aBlock.index,aBlock.previousHash, aBlock.timestamp, aBlock.data);


//call the candid block and previous block to compare
const isBlockValid = (
    candidateBlock : Block, 
    previousBlock : Block
): boolean => {
    if(!Block.validateStructure(candidateBlock)){
        return false;
    } else if(previousBlock.index + 1 !== candidateBlock.index) {
        return false;
    } else if(previousBlock.hash !== candidateBlock.previousHash) {
        return false;
    } else if(getHashForBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    }else {
        return true;
    }
};

const addBlock = (candidateBlock : Block) : void => {
    if(isBlockValid(candidateBlock,getLatestBlock())){
        blockChain.push(candidateBlock);
    }
};
createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockChain)
export {};