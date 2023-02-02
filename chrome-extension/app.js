// extract data from url
let url = location.href;
let url_data = url.split('/');
let site = url_data[2];
let screen = url_data[3].split('?')[0];

// ********** ZONIC **********

function inject_zonic() {

  add_jump_arrows();  // infinity scroll
  bind_hotkeys();     // hacker search

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

    // apetimism exclusive: show 3D asset
    if ((chain == CHAIN_OPTIMISM) && (contract.toLowerCase() == APETI_ADDR)) {
      let mint_key = APETI_MINT_KEYS[+token_id];
      if (mint_key == 'hidden') return;
      import_model_viewer();
      update_3d_asset(mint_key);
      console.log(`🐵 woo hoo!`);
    }
  }

  // NOT SUPPORT
  else {
    console.log(`🧩 not support url ${url}`);
  }

}

// ********** OPENSEA **********

function inject_opensea() {

  // HOME -- https://opensea.io
  if (screen == SCREEN_HOME) {
    console.log(`🧩 home`);
  }

  // ASSET -- https://opensea.io/asset/<chain>/<contract>/<id>
  else if (screen == SCREEN_ASSET_OS) {
    console.log(`🧩 screen -> asset`);

    let chain = url_data[4];
    let contract = url_data[5];
    let token_id = url_data[6];

    // add opensea icon
    console.log(chain, contract, token_id);
    /* TODO
    let os_chain = OS_CHAIN_MAPPER[chain];
    let url = `https://opensea.io/assets/${os_chain}/${contract}/${token_id}`;
    let os_icon = document.querySelector('.links-bar a.icon-etherscan').cloneNode();
    os_icon.classList.remove('icon-etherscan');
    os_icon.classList.add('icon-opensea');
    os_icon.href = url;
    document.querySelector('.links-bar').append(os_icon);
    */
  }

  // COLLECTION -- https://opensea.io/collection/<collection-name>
  else if (screen == SCREEN_COLLECTION) {
    console.log(`🧩 screen -> collection`);

    let data = document.querySelector('.sc-f0b2142c-0 a.sc-1f719d57-0').href.split('/');
    console.log(data);
    // ['https:', '', 'opensea.io', 'assets', 'optimism', '0x1e4e168c59033e6040eefe294c8d0a02aa770246', '5030']
    // ['https:', '', 'opensea.io', 'assets', 'arbitrum-nova', '0xaeb42df0e269a23177e962740c87cb2d1a2c25fc', '62']
  }

  // PROFILE --- https://opensea.io/[account|0xJigsaw]
  else if (screen && !url_data[4]) {
    console.log(`🧩 screen -> profile`);
  }

  // NOT SUPPORT
  else {
    console.log(`🧩 not support url ${url}`);
  }

}

// ********** MAIN **********

if (site == SITE_ZONIC)
  inject_zonic();
else if (site == SITE_OPENSEA)
  inject_opensea();
