const SCREEN_HOME       = '';
const SCREEN_PROFILE    = 'profile';
const SCREEN_ASSET      = 'asset';
const SCREEN_COLLECTION = 'collection';
const CHAIN_ARBI_NOVA   = 'arbitrum_nova';

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

// extract data from url
let url = location.href;
let url_data = url.split('/');
let screen = url_data[3];

// main
function main() {

  // HOME -- https://zonic.app
  if (screen == SCREEN_HOME) {
    console.log(`🧩 home`);
  }

  // PROFILE -- https://zonic.app/profile
  //         -- https://zonic.app/profile/<wallet>
  else if (screen == SCREEN_PROFILE) {
    console.log(`🧩 screen -> profile`);
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

    // opensea not support arbitrum nova
    if (chain == CHAIN_ARBI_NOVA) return;

    // add opensea icon
    let url = `https://opensea.io/assets/${chain}/${contract}/${token_id}`;
    let ico_opensea = ` <a class="icon icon-opensea fade-in" title="OpenSea" href="${url}" target="_blank"></a>`;
    find_dom('.token-name', el => { el.innerHTML += ico_opensea; });
  }

  // NOT SUPPORT
  else {
    console.log(`🧩 not support url ${url}`);
  }

}
main();
