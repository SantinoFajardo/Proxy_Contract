deploy-proxy:
	forge create src/Proxy.sol:Proxy --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --constructor-args 0x5FbDB2315678afecb367f032d93F642f64180aa3

deploy-implementation:
	forge create src/Implementation.sol:Implementation --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

test:
	forge test

run-anvil:
	anvil
