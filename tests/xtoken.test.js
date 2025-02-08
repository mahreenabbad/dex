import {
  Cl, //Provides utilities to create Clarity values (e.g., principal, uint, tuple)
  createStacksPrivateKey,
  cvToValue, // Converts Clarity values to JavaScript-readable formats.
  signMessageHashRsv, // Utility to sign a message hash using the RSV format, typically used for cryptographic signatures
} from "@stacks/transactions";
import { beforeEach, describe, expect, it } from "vitest";

// `simnet` is a "simulation network" - a local, testing Stacks node for running our tests
const accounts = simnet.getAccounts();

const contractOwner = accounts.get("wallet_1");
const user1 = accounts.get("wallet_2");
const user2 = accounts.get("wallet_3");

// describe("test x-token01 contract", () => {
//   beforeEach(() => {
//     // Mint tokens for the sender account
//     const mintResult = simnet.callPublicFn(
//       "x-token01", // Contract name
//       "mint", // Function name
//       [Cl.uint(1000), Cl.principal(user1)], // Mint 1000 tokens to the sender
//       contractOwner // Caller of the mint function
//     );

//     // Verify that the minting succeeded
//     expect(mintResult.events[0].event).toBe("ft_mint_event");
//     expect(mintResult.events[0].data.amount).toBe("1000");
//     expect(mintResult.events[0].data.recipient).toBe(sender);

//     // Verify the initial token balance of the sender
//     const balance = simnet.callReadOnlyFn(
//       "x-token01",
//       "get-balance",
//       [Cl.principal(user1)],
//       user1
//     );

//     expect(balance).toBeUint(1000);
//   });

//   it("should have correct initial owner", () => {
//     const owner = simnet.getDataVar("contract-owner");
//     expect(owner).toBePrincipal(contractOwner);
//   });
//   it("should initialize token metadata correctly", () => {
//     const name = simnet.callReadOnlyFn("x-token01", "get-name", []);
//     const symbol = simnet.callReadOnlyFn("x-token01", "get-symbol", []);
//     const decimals = simnet.callReadOnlyFn("x-token01", "get-decimals", []);
//     expect(name).toBe("xxtoken");
//     expect(symbol).toBe("XT");
//     expect(decimals).toBeUint(6);
//   });
// });

describe("token contract", () => {
  it("ensures the contract is deployed", () => {
    const contractSource = simnet.getContractSource("swap02");
    expect(contractSource).toBeDefined();
  });
  // it("should initialize token metadata correctly", async () => {
  //   const name = await simnet.callReadOnlyFn("x-token01", "get-name", []);
  //   expect(name).toBe("xxtoken");
  // });
});
