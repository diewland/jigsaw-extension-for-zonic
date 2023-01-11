// extract data from url
let url = location.href;
let url_data = url.split('/');
let screen = url_data[3];

// main
function main() {

  // jump to top
  add_jump_arrows();

  // hotkey
  bind_hotkeys();

  // HOME -- https://zonic.app
  if (screen == SCREEN_HOME) {
    console.log(`🧩 home`);
  }

  // PROFILE -- https://zonic.app/profile(/[wallet|username])
  else if (screen == SCREEN_PROFILE) {
    console.log(`🧩 screen -> profile`);

    // add opensea icon
    let op_icon = document.querySelector('.wallet-addresses-bar a');
    let wallet = op_icon.href.split('/')[4];
    let os_icon = op_icon.cloneNode();
    os_icon.innerHTML = op_icon.innerHTML;
    os_icon.querySelector('img').src = 'https://opensea.io/static/images/logos/opensea.svg';
    os_icon.href = `https://opensea.io/${wallet}`;
    document.querySelector('.wallet-addresses-bar').append(os_icon);
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
    find_dom('.controls-area i.mdi-refresh', el => {
      el.onclick = _ => {
        // set refresh screen delay
        setTimeout(_ => location.reload(), DELAY_REFRESH_METADATA);
        // update refresh icon
        find_dom('.controls-area i.mdi-refresh', el2 => {
          el2.classList.remove('mdi-refresh');
          add_loading_icon(el2);
        }, 100);
      }
    });

    // add opensea icon
    let os_chain = OS_CHAIN_MAPPER[chain];
    let url = `https://opensea.io/assets/${os_chain}/${contract}/${token_id}`;
    let os_icon = document.querySelector('.links-bar a.icon-etherscan').cloneNode();
    os_icon.classList.remove('icon-etherscan');
    os_icon.classList.add('icon-opensea');
    os_icon.href = url;
    document.querySelector('.links-bar').append(os_icon);
  }

  // NOT SUPPORT
  else {
    console.log(`🧩 not support url ${url}`);
  }

}
main();
