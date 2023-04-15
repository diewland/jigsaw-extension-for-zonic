// find dom(s)
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
function find(sel, callback) {
  let o = document.querySelector(sel);
  if (o) callback(o);
}

// search items
let search_sel = '.search-result-box>a>div';
let search_items = _ => document.querySelectorAll(search_sel);
function mark_search_item(index) {
  let items = search_items()
  if (items.length == 0) return;
  items.forEach(r => r.classList.remove('active'));
  items[index].classList.add('active');
}

// icons
function add_loading_icon(el) {
  el.classList.add('mdi-cog');
  el.classList.add('mdi-spin');
}
function remove_loading_icon(el) {
  el.classList.remove('mdi-cog');
  el.classList.remove('mdi-spin');
}
function craft_zonic_icon(url, h=24, l=5, va='baseline') {
  //return `<a href='${url}' title='Zonic : NFT Marketplace for L2'><img class='fade-in' style='height: ${h}px; margin-left: ${l}px; vertical-align: ${va};' src='https://zonic.app/logo3.svg' /></a>`;
  return `<a class='fade-in' style='text-decoration: none;' href='${url}' title='Zonic : NFT Marketplace for L2'>⚡</a>`;
}

// hotkey
function bind_hotkeys() {
  let search_index = -1;
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
        find(search_sel+'.active', o => o.parentElement.click());
        break
      default:
        search_index = -1;
        break
    }
  }
}

// jump to top -- https://stackoverflow.com/a/51689657/466693
function scrollToSmoothly(pos, time) {
    var currentPos = window.pageYOffset;
    var start = null;
    if(time == null) time = 500;
    pos = +pos, time = +time;
    window.requestAnimationFrame(function step(currentTime) {
        start = !start ? currentTime : start;
        var progress = currentTime - start;
        if (currentPos < pos) {
            window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
        } else {
            window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
        }
        if (progress < time) {
            window.requestAnimationFrame(step);
        } else {
            window.scrollTo(0, pos);
        }
    });
}
let jumping_flag = false;
let force_jump_stop = false;
function jump_to_end(prev_h=0, round=1) {
  console.log('round #', round);
  // height diff ? jump to end of page
  let h = document.body.scrollHeight;
  if (h != prev_h) {
    console.log('jump!');
    scrollToSmoothly(h);
    round = 0;
  }
  let next_round = round + 1;
  // break
  // 1) same height for 2 rounds
  // 2) jump to top
  if ((next_round > 2) || force_jump_stop) {
    console.log('break!');
    jumping_flag = false;
    force_jump_stop = false;
    find('.fixed-br i.mdi-pause', el => {
      el.classList.remove('mdi-pause');
      el.classList.add('mdi-arrow-down');
    });
    return;
  }
  // next round in 1s
  setTimeout(_ => {
    jump_to_end(h, next_round);
  }, 1_000);
}
function add_jump_arrows() {
  let jump_arrows = document.createElement('div');
  jump_arrows.innerHTML = `
  <div class='fixed-br'>
    <i title='Jump to Top' class='mdi-arrow-up mdi v-icon notranslate v-theme--dark v-icon--size-x-large text-white v-icon--clickable control-icon'></i><br>
    <i title='Jump to End' class='mdi-arrow-down mdi v-icon notranslate v-theme--dark v-icon--size-x-large text-white v-icon--clickable control-icon'></i>
  </div>
  `;
  document.body.prepend(jump_arrows);
  find('.fixed-br i.mdi-arrow-up', el => {
    el.onclick = _ => {
      force_jump_stop = true;
      scrollToSmoothly(0);
    }
  });
  find('.fixed-br i.mdi-arrow-down', el => {
    el.onclick = _ => {
      if (jumping_flag) {
        force_jump_stop = true;
        return;
      }
      jumping_flag = true;
      force_jump_stop = false;
      el.classList.remove('mdi-arrow-down');
      el.classList.add('mdi-pause');
      jump_to_end();
    }
  });
}

// model-viewer
function import_model_viewer() {
  // https://meet-martin.medium.com/using-javascript-es6-import-export-modules-in-chrome-extensions-f63a3a0d2736
  // 'use strict';
  const script = document.createElement('script');
  script.setAttribute("type", "module");
  script.setAttribute("src", "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js");
  const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
  head.insertBefore(script, head.lastChild);
}
function resolve_3d_url(token_id) {
  // (1) specific number
  if (token_id == 33) return 'https://cloudflare-ipfs.com/ipfs/bafybeib2afj2he7zmyxisrgohpvkuokb6o2mc64kddprztmymbjgie2ylq';
  // (2) mint keys
  let mint_key = APETI_MINT_KEYS[token_id];
  if (mint_key == 'hidden') return null;
  return `https://diewland.github.io/l9wdXJwb3N/amlnc2F3X2Nkbg/${mint_key}.glb`;
}
function update_3d_asset(url) {
  // craft model-viewer
  let html = `<model-viewer class="token-imagez" src="${url}" ar="true" ar-modes="webxr scene-viewer quick-look" environment-image="neutral" auto-rotate="true" camera-controls="true" ar-status="not-presenting"></model-viewer>`;
  // clone wrapper style from .token-image[data-v-0e26542b]
  let model = document.createElement('div');
  model.innerHTML = html;
  model.classList.add('token-imagez');
  // prepare dom
  let img = document.querySelector('.token-image');
  let rank = document.querySelector('.token-ranking');
  // adjust background image
  img.classList.add('bg-blur');
  // insert 3D model
  document.querySelector('.token-image-wrapper').insertBefore(model, rank);
  // toggle button
  let toggle = document.createElement('div');
  toggle.id = 'js-toggle-3d';
  toggle.innerHTML = `<i class="mdi-video-3d mdi v-icon notranslate v-theme--dark text-white icon" aria-hidden="true" data-v-8daef1fe="" style="font-size: 32px; height: 32px; width: 32px;"></i>`;
  toggle.classList.add('toggle-3dz');
  document.querySelector('.token-image-wrapper').append(toggle);
  toggle.onclick = evt => {
    let icon = document.querySelector('#js-toggle-3d i');
    let flag_3d = icon.classList.contains('mdi-video-3d');
    if (flag_3d) { // 3d -> 2d
      icon.classList.remove('mdi-video-3d');
      icon.classList.add('mdi-video-3d-off');
      img.classList.remove('bg-blur');
      model.style.visibility = 'hidden';
    }
    else { // 2d -> 3d
      icon.classList.remove('mdi-video-3d-off');
      icon.classList.add('mdi-video-3d');
      img.classList.add('bg-blur');
      model.style.visibility = 'visible';
    }
  };
}

// url
function craft_url(base, params) {
  let new_url = new URL(base);
  new_url.search = new URLSearchParams(params);
  return new_url.toString();
}
function craft_reveal_url(base, params, from_id, to_id) {
  base = base.replace(/\d+$/, from_id);
  params.from_id = from_id;
  params.to_id = to_id;
  return craft_url(base, params);
}

// box
function craft_reveal_box(src_node, from_id=1) {
  // clone from properties box
  let reveal_box = src_node.cloneNode();
  reveal_box.classList.remove('token-properties');
  reveal_box.classList.add('auto-reveal-tool');
  reveal_box.innerHTML = src_node.innerHTML;
  // update header
  let icon = reveal_box.querySelector('.box-header i');
  icon.classList.remove('mdi-view-grid-outline');
  icon.classList.add('mdi-tools');
  reveal_box.querySelector('.box-header-text').innerHTML = 'Auto Reveal Tool';
  reveal_box.querySelector('.box-header-expandable-icon').style.display = 'none';
  // update form
  reveal_box.querySelector('.box-body').innerHTML = `
    <div class="dialog-section" data-v-c2b171d0="" style='width: 30%; float: left; margin-right: 10px;'>
      <div class="dialog-section-label" data-v-c2b171d0="">From ID</div>
      <div class="dialog-input-container" data-v-c2b171d0="">
        <input id='jig_from_id' class="dialog-section-input-box" type="number" min="0" step="1" placeholder="From ID" data-v-c2b171d0="" value='${from_id}'>
      </div>
    </div>
    <div class="dialog-section" data-v-c2b171d0="" style='width: 30%; float: left; margin-right: 10px;'>
      <div class="dialog-section-label" data-v-c2b171d0="">To ID</div>
      <div class="dialog-input-container" data-v-c2b171d0="">
        <input id='jig_to_id' class="dialog-section-input-box" type="number" min="0" step="1" placeholder="To ID" data-v-c2b171d0="">
      </div>
    </div>
    <div class='cta-area' style='width: 30%; float: left; margin-right: 10px; margin-top: 22px;'>
      <div id='jig_reveal' class="btn-cta noselect" data-v-75042818="" style='margin-top: 0px;'>Run</div>
    </div>
    <div style='clear: both;'></div>
  `;
  return reveal_box;
}
