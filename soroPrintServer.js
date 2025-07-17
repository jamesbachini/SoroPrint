const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const StellarSdk = require('stellar-sdk');
const rpc = new StellarSdk.rpc.Server('https://soroban-testnet.stellar.org');

const contractId = 'CDEKWHMZNDI3MWKMZ55HFVPVYXVCBRICDKUJROWWHOQQ4YKLR5NL5WOU';
const eventsProcessed = [];

const print = (message) => {
    const tempFilePath = path.join(os.tmpdir(), `print-${Date.now()}.txt`);
    fs.writeFileSync(tempFilePath, message);
    const platform = os.platform();
    let command;
    if (platform === 'win32') {
        command = `notepad /p "${tempFilePath}"`;
    } else if (platform === 'darwin' || platform === 'linux') {
        command = `lp "${tempFilePath}"`;
    } else {
        console.error(`Unsupported platform: ${platform}`);
        process.exit(1);
    }
    exec(command, (error, stdout, stderr) => {
        if (error) return console.error(`Error printing: ${error.message}`);
        if (stderr) console.error(`stderr: ${stderr}`);
        console.log('Message sent to printer.');
        fs.unlink(tempFilePath, err => {
            if (err) console.warn(`Could not delete temp file: ${tempFilePath}`);
        });
    });
}

const processEvents = async (eventsResponse) => {
    try {
        for (const event of eventsResponse.events) {
            let text = event.value._value.toString();
            const alreadySeen = eventsProcessed.includes(event.id);
            eventsProcessed.push(event.id);
            if (!alreadySeen) print(text);
        }
    } catch (error) {
        console.error('Error processing events:', error);
    }
}

const checkEvents = async () => {
    try {
        const latestLedger = await rpc.getLatestLedger();
        const eventsResponse = await rpc.getEvents({
            startLedger: latestLedger.sequence - 60,
            filters: [
                {
                    type: "contract",
                    contractIds: [contractId],
                },
                {
                    type: "system", 
                    contractIds: [contractId],
                },
            ],
        });
        if (eventsResponse.events && eventsResponse.events.length > 0) {
            await processEvents(eventsResponse);
        }
    } catch (error) {
        console.error('Error checking events:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

const runCheckEvents = async () => {
    await checkEvents();
};


console.log('Checking Events...')
runCheckEvents();
setInterval(() => {
    runCheckEvents().catch(error => {
        console.error('Interval error:', error);
    });
}, 15000);