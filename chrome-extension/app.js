// screen variables
let url = null;
let url_data = null;
let site = null;
let screen = null;

// extract data from url
function extract_url_data(new_url) {
  url = new_url;
  url_data = url.split('/');
  site = url_data[2];
  screen = url_data[3].split('?')[0];
}
extract_url_data(location.href);

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
    os_icon.target = '_self';
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
    os_icon.target = '_self';
    document.querySelector('.links-bar').append(os_icon);

    // apetimism exclusive: show 3D asset
    if ((chain == CHAIN_OPTIMISM) && (contract.toLowerCase() == APETI_ADDR)) {
      let url = resolve_3d_url(+token_id);
      if (url == null) return;
      import_model_viewer();
      update_3d_asset(url);
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

    // check supported chain
    if (!SUPPORTED_CHAINS.includes(chain)) return;

    // add zonic icon
    // TODO find new icon location
    find_dom('.item--title', el => {
      let zonic_chain = ZONIC_CHAIN_MAPPER[chain];
      let url = `https://zonic.app/asset/${zonic_chain}/${contract}/${token_id}`;
      el.innerHTML += craft_zonic_icon(url);
    });
  }

  // COLLECTION -- https://opensea.io/collection/<collection-name>
  else if (screen == SCREEN_COLLECTION) {
    console.log(`🧩 screen -> collection`);

    find_dom("article a[href]:not([href=''])", el => {
      let [_, __, ___, ____, chain, contract, token_id] = el.href.split('/');

      // check supported chain
      if (!SUPPORTED_CHAINS.includes(chain)) return;

      // add zonic icon
      // TODO find new icon location
      let zonic_chain = ZONIC_CHAIN_MAPPER[chain];
      let url = `https://zonic.app/collection/${zonic_chain}/${contract}`;
      document.querySelector('h1.sc-29427738-0').innerHTML += craft_zonic_icon(url);
    }, 500);
  }

  // PROFILE --- https://opensea.io/[account|0xJigsaw]
  // TODO https://opensea.io/account/collected
  else if (screen && !url_data[4]) {
    console.log(`🧩 screen -> profile`);

    // TODO how to get wallet address ?

    /* TODO not work with user w/o social links (ex https://opensea.io/nuuneoi)
    // get icon bar
    let sel = '.sc-29427738-0.sc-630fc9ab-0.sc-35f75ba4-0';
    let bar = document.querySelector(sel);
    // craft zonic icon
    let icon1 = document.querySelector(sel + ' a.sc-1f719d57-0');
    let zonic_icon = icon1.cloneNode();
    zonic_icon.innerHTML = icon1.innerHTML;
    zonic_icon.querySelector('button').innerHTML = `<img src='https://zonic.app/logo3.svg'>`;
    zonic_icon.classList.add('fade-in');
    zonic_icon.href = 'https://zonic.app/profile/apetimism';
    // inject zonic to icon bar
    bar.prepend(zonic_icon);
    */
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

// fix opensea doesn't execute script when screen changed
let prev_os_url = null;
navigation.addEventListener("navigate", e => {
  let new_url = e.destination.url;
  extract_url_data(new_url);
  if (site != SITE_OPENSEA) return;
  if (new_url == prev_os_url) return;
  console.log('🌊 ' + new_url);
  prev_os_url = new_url;
  inject_opensea();
});
