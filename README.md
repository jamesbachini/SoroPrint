# 🖨️ SoroPrint – Decentralized Web3 Office Printer

An experiment to connect a physical office printer to the Stellar blockchain using Soroban smart contracts, event listeners, and command-line printing.

[https://github.com/jamesbachini/SoroPrint](https://github.com/jamesbachini/SoroPrint)

**Key components:**

1. A Soroban smart contract emitting `print` events.
2. A local Node.js monitor that listens to the Stellar RPC network.
3. A cross-platform print script using system tools.

---

## 1. 🧱 Deploy the Soroban Contract

The contract exposes a single `print` function that emits a `print` event with the user-supplied text.

```rust
#[contractimpl]
impl SoroPrint {
    pub fn print(env: Env, text: Symbol) {
        env.events().publish((symbol_short!("print"),), text);
    }
}
```

### Build & Deploy (testnet):

```bash
cargo build --target wasm32v1-none --release

stellar contract deploy \
  --wasm target/wasm32v1-none/release/soroprint.wasm \
  --source james \
  --network testnet
```

### Invoke Example:

```bash
stellar contract invoke \
  --id <YOUR_CONTRACT_ID> \
  --source-account james \
  --network testnet \
  -- print --text "Hello Soroban"
```

---

## 2. 📡 Monitor Events via RPC

Use the `stellar-sdk` for polling events every 15 seconds from the testnet.

```js
const eventsResponse = await rpc.getEvents({
  startLedger: latest.sequence - 60,
  filters: [{ type: "contract", contractIds: [contractId] }]
});
```

Unseen events are logged and passed to the print function.

---

## 3. 🖨️ Cross-Platform Print from Node.js

A basic print handler using:

* `notepad /p` on Windows
* `lp` on Mac/Linux

```js
fs.writeFileSync(tempFilePath, message);
exec(`lp "${tempFilePath}"`, ...);
```

Temporary files are deleted after each print job.

---

## 4. 🧠 Putting It All Together

The `soroprint-server.js` combines event monitoring and printing:

```bash
node soroprint-server.js
```

This script will continuously listen for new blockchain messages and send them directly to your printer. Leave it running on a device for continuous blockchain-to-paper messaging.

---

## 📂 Project Structure

```
.
├── contract/           # Soroban smart contract (Rust)
├── monitor/            # Node.js event monitor + print scripts
├── soroprint-server.js # Combined daemon script
└── README.md           # <-- You're here
```

---

## ⚠️ Notes

* Requires printer support on the local system.
* Print command behavior may vary by OS/driver.
* Works on Stellar testnet. Mainnet integration is possible.

---

## 📝 License

MIT

---

## 🔗 Links

Developer Quick Start:
https://stellar.org/developers?utm_source=james-bachini&utm_medium=social&utm_campaign=lemonade-kol-developers-q2-25

Developer Docs:
https://developers.stellar.org/?utm_source=james-bachini&utm_medium=social&utm_campaign=lemonade-kol-dev-docs-q2-25

Dev Diaries:
https://stellar.org/?utm_source=james-bachini&utm_medium=social&utm_campaign=lemonade-kol-dev-diaries-q2-25

Flipside Challenges:
https://flipsidecrypto.xyz/earn/journey/stellar-onboarding?utm_source=james-bachini&ut[…]dium=social&utm_campaign=lemonade-kol-flipside-quests-q2-25

Stellar Main Site:
https://stellar.org/?utm_source=james-bachini&utm_medium=social&utm_campaign=lemonade-kol-general-q2-25

Meridian 2025:
https://meridian.stellar.org/register?utm_source=james-bachini&utm_medium=social&utm_campaign=lemonade-kol-meridian-2025-q2-25
