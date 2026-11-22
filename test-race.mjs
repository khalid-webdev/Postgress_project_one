const walletId = "f051960b-7747-4ed7-afaf-e5129b1c420b";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzI0NWQ5Yi1mMzg0LTQ5NmUtODllNC1jNWEzNTNmMDRjZjEiLCJpYXQiOjE3OTUzMTY1OTEsImV4cCI6MTc5NTMxNzQ5MX0.I7kZIxXrVZH27Qd0UUbnaI0BFU0060lvDkIqqctPTPU";

const url = `http://localhost:5000/api/v1/wallets/withdraw/${walletId}`;

const makeWithdrawal = async (key) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Idempotency-Key": key,
    },
    body: JSON.stringify({
      amountMinor: "50000",
    }),
  });


  return {
    status: response.status,
    body: await response.json()
  }
};

// const results = await Promise.all([
//   makeWithdrawal("concurrent-withdrawal-aa"),
//   makeWithdrawal("concurrent-withdrawal-bb"),
// ]);

// console.log(results);

const depositUrl = `http://localhost:5000/api/v1/wallets/deposit/${walletId}`;

const makeDeposit = async (key) => {
  const response = await fetch(depositUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Idempotency-Key": key,
    },
    body: JSON.stringify({
      amountMinor: "50000",
    }),
  });


  return {
    status: response.status,
    body: await response.json()
  }
};

const results = await Promise.all([
  makeDeposit("concurrent-deposit-aa"),
  makeDeposit("concurrent-deposit-bb"),
]);

console.log(results);
