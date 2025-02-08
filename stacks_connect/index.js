import {
  Cl,
  Pc,
  cvToValue,
  principalCV,
  makeContractCall,
  stringAsciiCV,
  createStacksPrivateKey,
  makeRandomPrivKey,
  getPublicKey,
  makeContractDeploy,
  broadcastTransaction,
  contractPrincipalCV,
  uintCV,
  callReadOnlyFunction,
  PostConditionMode,
  bufferCVFromString,
  bufferCV,
  someCV,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
} from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";
import { readFileSync } from "fs";
import { generateWallet, generateNewAccount } from "@stacks/wallet-sdk";

const tokenXTrait = contractPrincipalCV(
  "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
  "x-token01"
);
const tokenYTrait = contractPrincipalCV(
  "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
  "y-token01"
);
// // PRIVATE KEY GENERATE
// async function keyGenerate() {
//   let wallet = await generateWallet({
//     secretKey:
//       "seed phrase",
//     password: "",
//   });
//   wallet = generateNewAccount(wallet);
//   const account = wallet.accounts[0];
//   const privatK = account.stxPrivateKey;
//   console.log("private key", privatK);

//   console.log(wallet.accounts.length);
// }
// keyGenerate();
//account 1 = enter your private key
//account 2 = aa66bf47290bc8d63fee301

/////////////////////////////////////////
// SMART_CONTRACT_ DEPLOY_TRANSACTION

// const txOptions = {
//   contractName: "swap02",
//   codeBody: readFileSync("contracts/swap02.clar").toString(),
//   senderKey:
//     "enter your private key",
//   network: "testnet",
// };

// // console.log(txOptions);
// async function deployContract() {
//   try {
//     // Create a deploy transaction
//     const transaction = await makeContractDeploy(txOptions);
//     // console.log(transaction);
//     // Broadcast the transaction
//     const broadcastResponse = await broadcastTransaction(
//       transaction,
//       txOptions.network
//     );
//     console.log("Broadcast Response:", broadcastResponse);
//   } catch (error) {
//     console.error("Error deploying contract:", error);
//   }
// }
// deployContract();
////////////////////////////////////////////////////////////////////

//  get-total-supply function

// Define the function args (empty for read-only functions)
// const principal = principalCV(
//   "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.swap02"
// );
// const options = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "y-token01",
//   functionName: "get-balance",
//   functionArgs: [principal],
//   network: "testnet",
//   senderAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
// };
// console.log(options); // Call the read-only function using callReadOnlyFunction
// async function callTotalSupply() {
//   try {
//     const response = await callReadOnlyFunction(options);

//     // Convert the returned Clarity value to JavaScript value
//     //   const supply = cvToValue(response);
//     console.log("Total Supply :", response);
//     //   const data = response.value.data;
//     //   console.log("Total supply of xtoken:", data.fee.value);
//   } catch (error) {
//     console.log("transaction error: ", error);
//   }
// }
// callTotalSupply();
/////////////////////////////////////////////////////////////////////////////

// Call mintFunction

// // mint -Function
// const recipientPrincipal = principalCV(
//   "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV"
// );

// const amount = Cl.uint(1000000000);
// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "x-token01",
//   functionName: "mint",
//   functionArgs: [
//     amount, // `amount` as a Clarity uint
//     recipientPrincipal, // `recipient` as a Clarity principal
//   ],

//   PostConditionMode: PostConditionMode.Allow,
//   senderKey:
//     "enter your private key",
//   network: "testnet",
// };

// // console.log("txOptions :", txOptions);

// async function minting() {
//   try {
//     // Create and broadcast the transaction
//     const transaction = await makeContractCall(txOptions);

//     // console.log("Transaction:", transaction);
//     const response = await broadcastTransaction(transaction, "testnet");
//     console.log("Response:", response);
//   } catch (error) {
//     console.log("Transaction Error:", error);
//   }
// }
// minting();
/////////////////////////////////////////
//ADD_TO_POSITION  FUNCTION

// Define contract principals for token traits

// define post conditions
// const postCondition = Pc.principal("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV")
//   .willSendGte(10000000)
//   .ft("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.x-token01", "xxtoken");
// const postCondition1 = Pc.principal("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV")
//   .willSendGte(5000000)
//   .ft("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.y-token01", "yytoken");

// const x = Cl.uint(10000000);
// const y = Cl.uint(5000000);
// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "swap02",
//   functionName: "add-to-position",
//   functionArgs: [
//     tokenXTrait,
//     tokenYTrait,
//     x, // `amount` as a Clarity uint
//     y,
//   ],
//   postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderKey:
//     "enter your private key",

//   network: "testnet",
//   validateWithAbi: true,
// };

// // console.log("txOptions :", txOptions);
// async function callAddtoPosition() {
//   try {
//     // Create and broadcast the transaction

//     const transaction = await makeContractCall(txOptions);
//     // console.log("Transaction:", transaction);
//     const response = await broadcastTransaction(transaction, "testnet");
//     console.log("Response:", response);
//     // console.log("Function Args:", txOptions.functionArgs);
//   } catch (error) {
//     console.error("Error during transaction execution:", error);
//   }
// }
// callAddtoPosition();
////////////////////////////////////////////////

// CREATE_PAIR FUNCTION
// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "swap02",
//   functionName: "create-pair",
//   functionArgs: [
//     tokenXTrait,
//     tokenYTrait,
//     stringAsciiCV("XT-YT"),
//     uintCV(100000000), // Initial amount of token X
//     uintCV(50000000), // Initial amount of token Y
//   ],
//   senderKey:
//     "enter your private key", // Replace with the private key of the contract owner
//   network: "testnet",
//   postConditions: [], // Define post conditions if required
//   postConditionMode: PostConditionMode.Allow,
//   //   validateWithAbi: true, // Validate the transaction against the contract's ABI
// };

// // console.log("txOptions", txOptions);
// async function callCreatePair() {
//   try {
//     const transaction = await makeContractCall(txOptions);
//     // console.log("Transaction", transaction);
//     // Broadcast the transaction
//     const broadcastResponse = await broadcastTransaction(
//       transaction,
//       "testnet"
//     );
//     console.log("Transaction Response:", broadcastResponse);
//   } catch (error) {
//     console.error("Error during transaction execution:", error);
//   }
// }
// callCreatePair();

/////////////////////////////////////////////

//SWAP- FUNCTION CALL
// // define post conditions
// const postCondition = Pc.principal("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV")
//   .willSendGte(100000)
//   .ft("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.x-token01", "xxtoken");
// const postCondition1 = Pc.principal("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV")
//   .willSendGte(1000)
//   .ft("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.y-token01", "yytoken");

// const dx = Cl.uint(500000); // Example amount for token-x
// const minDy = Cl.uint(3000);
// const options = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV", // Your contract address
//   contractName: "swap02", // Your contract name
//   functionName: "swap-x-for-y", // Function name to call
//   functionArgs: [
//     tokenXTrait,
//     tokenYTrait,
//     dx, // Amount of token-x
//     minDy, // Minimum amount of token-y expected
//   ],
//   // Use Stacks Testnet
//   senderKey:
//     "enter your private key",
//   network: "testnet",
//   fee: 2000000n,

//   //   postConditions: [postCondition, postCondition1], // Define post conditions if required
//   postConditionMode: PostConditionMode.Allow,
//   validateWithAbi: true, // library compares your provided function arguments (functionArgs) against the ABI of the specified function.
// };
// // console.log("options :", options);
// async function swapTokens() {
//   try {
//     // Create the transaction
//     const transaction = await makeContractCall(options);

//     // Broadcast the transaction to the Stacks blockchain
//     const response = await broadcastTransaction(transaction, "testnet");
//     console.log("Transaction Response:", response);
//   } catch (error) {
//     console.error("Error during the transaction:", error);
//   }
// }

// swapTokens();

///////////////////////////////////////////////
//SWAP _ Y TO X

// const dy = Cl.uint(1000000); // Example amount for token-x
// const minDx = Cl.uint(10000);
// const options = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV", // Your contract address
//   contractName: "swap02", // Your contract name
//   functionName: "swap-y-for-x", // Function name to call
//   functionArgs: [
//     tokenXTrait,
//     tokenYTrait,
//     dy, // Amount of token-x
//     minDx, // Minimum amount of token-y expected
//   ],
//   // Use Stacks Testnet
//   senderKey:
//     "enter your private key",
//   network: "testnet",
//   fee: 2000000n,

//   //   postConditions: [postCondition, postCondition1], // Define post conditions if required
//   postConditionMode: PostConditionMode.Allow,
//   validateWithAbi: true, // library compares your provided function arguments (functionArgs) against the ABI of the specified function.
// };
// // console.log("options :", options);
// async function swapTokens() {
//   try {
//     // Create the transaction
//     const transaction = await makeContractCall(options);

//     // Broadcast the transaction to the Stacks blockchain
//     const response = await broadcastTransaction(transaction, "testnet");
//     console.log("Transaction Response:", response);
//   } catch (error) {
//     console.error("Error during the transaction:", error);
//   }
// }

// swapTokens();
///////////////////////////////////////////////////////////////

// CHECK BALANCE
// async function checkBalances() {
//   const balanceXOptions = {
//     contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//     contractName: "x-token",
//     functionName: "get-balance",
//     functionArgs: [
//       Cl.principal("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.swap02"),
//     ],
//     network: "testnet",
//     senderAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   };

//   const balanceYOptions = {
//     contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//     contractName: "y-token",
//     functionName: "get-balance",
//     functionArgs: [
//       Cl.principal("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.swap02"),
//     ],
//     network: "testnet",
//     senderAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   };

//   try {
//     const balanceX = await callReadOnlyFunction(balanceXOptions);
//     const balanceY = await callReadOnlyFunction(balanceYOptions);

//     console.log("Balance of token-x:", balanceX);
//     console.log("Balance of token-y:", cvToValue(balanceY));
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// checkBalances();
//////////////////////////////////////////////////////////////
// Transfer function
// With a standard principal
//

// const postCondition = Pc.principal("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV")
//   .willSendGte(10000000)
//   .ft("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.x-token01", "xxtoken");

// ///////////
// const senderPrincipal = principalCV("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV");
// const recipientPrincipal = principalCV(
//   "ST11SKCKNE62GT113W5GZP4VNB47536GFH9QWNJW2"
// );
// // Construct the optional memo argument
// //const memo = someCV(bufferCV(Buffer.alloc(34, 0))); // Leave empty for no memo
// const amount = Cl.uint(10000000);
// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "x-token01",
//   functionName: "transfer",
//   functionArgs: [
//     amount, // `amount` as a Clarity uint
//     senderPrincipal, // `sender` as a Clarity principal
//     recipientPrincipal, // `recipient` as a Clarity principal
//     Cl.none(), // `memo` as a Clarity optional buffer
//   ],
//   postConditions: [postCondition],
//   PostConditionMode: PostConditionMode.Allow,
//   senderKey:
//     "enter your private key",
//   network: "testnet",
//   senderPrincipal,
// };

// // console.log("txOptions :", txOptions);

// // Create and broadcast the transaction
// const transaction = await makeContractCall(txOptions);

// // console.log("Transaction:", transaction);
// const response = await broadcastTransaction(transaction, "testnet");
// console.log("Response:", response);
// console.log("Function Args:", txOptions.functionArgs);
