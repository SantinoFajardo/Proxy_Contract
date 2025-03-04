deploy-proxy:
	@export $(shell cat .env | xargs) && forge create src/Proxy.sol:Proxy --rpc-url $$RPC_URL --broadcast --private-key $$PRIVATE_KEY --constructor-args $$IMPLEMENTATION_ADDRESS

deploy-implementation:
	@export $(shell cat .env | xargs) && forge create src/Implementation.sol:Implementation --rpc-url $$RPC_URL --broadcast --private-key $$PRIVATE_KEY

test:
	@export $(shell cat .env | xargs) && forge test

run-anvil:
	@export $(shell cat .env | xargs) && anvil
