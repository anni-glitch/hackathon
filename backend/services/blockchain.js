const { ethers } = require('ethers');

// Mock Blockchain Service (since we might not have a running Ganache instance in this environment)
// In a real scenario, this would connect to a local Ganache provider.

class BlockchainService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider('http://localhost:8545'); // Default Ganache port
        this.wallet = null;
        this.contract = null;
        this.isConnected = false;
    }

    async init() {
        try {
            // Check if provider is ready
            const network = await this.provider.getNetwork();
            console.log('Connected to blockchain network:', network.name);

            // Setup wallet (using a default Ganache private key for demo)
            // DANGER: Never use this in production
            const privateKey = '0x' + '0'.repeat(63) + '1'; // Mock key or env var
            this.wallet = new ethers.Wallet(privateKey, this.provider);
            this.isConnected = true;
        } catch (error) {
            console.warn('Blockchain connection failed (Ganache might not be running). Using mock mode.');
            this.isConnected = false;
        }
    }

    async logAction(actionType, userId, details) {
        const logEntry = {
            timestamp: Date.now(),
            actionType,
            userId,
            details,
            hash: this.generateHash(actionType, userId, details)
        };

        if (this.isConnected) {
            // In a real app, send transaction to smart contract
            // await this.contract.addLog(logEntry.hash);
            console.log('Blockchain transaction sent:', logEntry.hash);
        } else {
            console.log('Mock Blockchain Log:', logEntry);
        }

        return logEntry;
    }

    generateHash(actionType, userId, details) {
        return ethers.id(`${actionType}-${userId}-${JSON.stringify(details)}-${Date.now()}`);
    }
}

module.exports = new BlockchainService();
