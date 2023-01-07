const KEY_SLASH         = '/';
const KEY_ESC           = 'Escape';
const KEY_ARROW_UP      = 'ArrowUp';
const KEY_ARROW_DOWN    = 'ArrowDown';
const KEY_ENTER         = 'Enter';
const SCREEN_HOME       = '';
const SCREEN_PROFILE    = 'profile';
const SCREEN_ASSET      = 'asset';
const SCREEN_COLLECTION = 'collection';
const CHAIN_OPTIMISM    = 'optimism';
const CHAIN_ARBI_ONE    = 'arbitrum_one';
const CHAIN_ARBI_NOVA   = 'arbitrum_nova';
const OS_CHAIN_MAPPER   = {
  [CHAIN_OPTIMISM]  : 'optimism',
  [CHAIN_ARBI_ONE]  : 'arbitrum',
  [CHAIN_ARBI_NOVA] : 'arbitrum_nova',
};
const DELAY_REFRESH_METADATA = 15 * 1_000; // 15s
