/*
  Test script to check that paging events from an RPC node works
*/

const StellarSdk = require('stellar-sdk');
const rpc = new StellarSdk.rpc.Server('https://soroban-testnet.stellar.org');

const contractId = 'CDEKWHMZNDI3MWKMZ55HFVPVYXVCBRICDKUJROWWHOQQ4YKLR5NL5WOU';
const eventsProcessed = [];

const processEvents = async (eventsResponse) => {
    try {
        for (const event of eventsResponse.events) {
            //console.log('Event ID: ', event.id);
            //console.log(`Topics: `, event.topic);
            let text = event.value._value.toString();
            console.log('Event Text: ', text);
            const alreadySeen = eventsProcessed.includes(event.id);
            eventsProcessed.push(event.id);
            if (!alreadySeen) {
                console.log('### PRINT HERE ###', text);
            }
        }
    } catch (error) {
        console.error('Error processing events:', error);
    }
}

const checkEvents = async () => {
    try {
        console.log('Checking Events...')
        const latestLedger = await rpc.getLatestLedger();
        //console.log('t1 latestLedger.sequence:', latestLedger.sequence)
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
        console.log('Events found:', eventsResponse.events.length);
        if (eventsResponse.events && eventsResponse.events.length > 0) {
            await processEvents(eventsResponse);
        } else {
            console.log('No events found');
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

runCheckEvents();
setInterval(() => {
    runCheckEvents().catch(error => {
        console.error('Interval error:', error);
    });
}, 15000);