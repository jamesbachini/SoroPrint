#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Symbol, Env};

#[contract]
pub struct SoroPrint;

#[contractimpl]
impl SoroPrint {
    pub fn print(env: Env, text: Symbol) {
        env.events().publish((symbol_short!("print"),), text);
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Events, Env};

    #[test]
    fn test_print_event() {
        let env = Env::default();
        let contract_id = env.register(SoroPrint, ());
        let client = SoroPrintClient::new(&env, &contract_id);
        let msg = symbol_short!("hello");
        client.print(&msg);
        let events = env.events().all();
        assert_eq!(events.len(), 1);
    }
}

