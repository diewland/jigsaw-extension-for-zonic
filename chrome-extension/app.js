const KEY_SLASH         = '/';
const KEY_ESC           = 'Escape';
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

// common
function find_dom(sel, callback, delay=1_000, retry=10, counter=0) {
  setTimeout(_ => {
    counter += 1;
    console.log(`(${counter}/10) find [${sel}] ..`);
    let dom = document.querySelector(sel);
    if (dom)
      callback(dom);
    else if (counter < retry)
      find_dom(sel, callback, delay, retry, counter);
  }, delay);
}
let os_icon = url => `<a class="ic-opensea fade-in" title="OpenSea" href="${url}" target="_blank"></a>`;
let os_icon_sm = url => `<a class="ic-opensea ic-sm fade-in" title="OpenSea" href="${url}" target="_blank"></a>`;

// extract data from url
let url = location.href;
let url_data = url.split('/');
let screen = url_data[3];

// main
function main() {

  // hotkey
  document.body.onkeyup = evt => {
    switch(evt.key) {
      case KEY_ESC: // clear search bar
        document.querySelector('.search-bar .clear-icon i').click();
        break
      case KEY_SLASH: // focus on search bar
        document.querySelector('.search-input').focus();
        break
    }
  }

  // HOME -- https://zonic.app
  if (screen == SCREEN_HOME) {
    console.log(`🧩 home`);
  }

  // PROFILE
  else if (screen == SCREEN_PROFILE) {
    console.log(`🧩 screen -> profile`);

    // add opensea icon
    function add_os_icon(wallet) {
      let url = `https://opensea.io/${wallet}`;
      find_dom('.wallet-name', el => { el.innerHTML += os_icon_sm(url); });
    }
    // (1) https://zonic.app/profile, https://zonic.app/profile/
    if ((url_data.length == 4) ||
       ((url_data.length == 5) && (!url_data[4]))) {
      // find wallet address from (first) nft owner
      find_dom('.token-owner a', el => {
        link_data = el.href.split('/');
        let wallet = link_data[4];
        add_os_icon(wallet);
      });
    }
    // (2) https://zonic.app/profile/<wallet>
    else if (url_data.length == 5) {
      let wallet = url_data[4];
      add_os_icon(wallet);
    }
  }

  // COLLECTION -- https://zonic.app/collection/<chain>/<contract>
  else if (screen == SCREEN_COLLECTION) {
    console.log(`🧩 screen -> collection`);
    // cannot resolve opensea url -> https://opensea.io/collection/<custom-collection-name>
  }

  // ASSET -- https://zonic.app/asset/<chain>/<contract>/<id>
  else if (screen == SCREEN_ASSET) {
    console.log(`🧩 screen -> asset`);

    let chain = url_data[4];
    let contract = url_data[5];
    let token_id = url_data[6];

    // auto reload screen when click Refresh Metadata
    find_dom('.controls-area i', el => {
      el.onclick = _ => {
        // set refresh screen delay
        setTimeout(_ => location.reload(), DELAY_REFRESH_METADATA);
        // update refresh icon
        find_dom('.controls-area i', el2 => {
          el2.classList.remove('mdi-refresh');
          el2.classList.add('mdi-cog');
          el2.classList.add('mdi-spin');
        }, 100);
      }
    });

    // opensea not support arbitrum nova
    if (chain == CHAIN_ARBI_NOVA) return;

    // add opensea icon
    let os_chain = OS_CHAIN_MAPPER[chain];
    let url = `https://opensea.io/assets/${os_chain}/${contract}/${token_id}`;
    find_dom('.token-name', el => { el.innerHTML += os_icon(url); });
  }

  // NOT SUPPORT
  else {
    console.log(`🧩 not support url ${url}`);
  }

}
main();