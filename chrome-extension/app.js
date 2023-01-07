// extract data from url
let url = location.href;
let url_data = url.split('/');
let screen = url_data[3];

// state
let search_index = -1;

// main
function main() {

  // jump to top
  add_jump_arrows();

  // hotkey
  document.body.onkeyup = evt => {
    switch(evt.key) {
      case KEY_ESC: // clear search bar
        search_index = -1;
        find('.search-bar .clear-icon i', o => o.click());
        break
      case KEY_SLASH: // focus on search bar
        search_index = -1;
        find('.search-input', o => o.focus());
        break
      case KEY_ARROW_UP: // move cursor up
        if ((search_items().length == 0)||(search_index <= 0)) return;
        search_index -= 1;
        mark_search_item(search_index);
        break
      case KEY_ARROW_DOWN: // move cursor down
        let size = search_items().length;
        if ((size == 0)||(search_index >= size-1)) return;
        search_index += 1;
        mark_search_item(search_index);
        break
      case KEY_ENTER: // select item
        find('.search-result-item.active a', o => o.click());
        break
      default:
        search_index = -1;
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
