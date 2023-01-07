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
let search_items = _ => document.querySelectorAll('.search-result-item');
function mark_search_item(index) {
  let items = search_items()
  if (items.length == 0) return;
  items.forEach(r => r.classList.remove('active'));
  items[index].classList.add('active');
}

// icons
let os_icon = url => `<a class="ic-opensea fade-in" title="OpenSea" href="${url}" target="_blank"></a>`;
let os_icon_sm = url => `<a class="ic-opensea ic-sm fade-in" title="OpenSea" href="${url}" target="_blank"></a>`;
function add_loading_icon(el) {
  el.classList.add('mdi-cog');
  el.classList.add('mdi-spin');
}
function remove_loading_icon(el) {
  el.classList.remove('mdi-cog');
  el.classList.remove('mdi-spin');
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
function jump_to_end(prev_h=0, round=0) {
  console.log('round #', round);
  // break
  // 1) same height for 3s
  // 2) jump to top
  if ((round == 3) || force_jump_stop) {
    console.log('break!');
    jumping_flag = false;
    force_jump_stop = false;
    find('.fixed-br i.mdi-spin', el => {
      remove_loading_icon(el);
      el.classList.add('mdi-arrow-down');
    });
    return;
  }
  // height diff ? jump to end of page
  let h = document.body.scrollHeight;
  if (h != prev_h) {
    console.log('jump!');
    scrollToSmoothly(h);
    round = 0;
  }
  // next round in 1s
  setTimeout(_ => {
    jump_to_end(h, ++round);
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
      if (jumping_flag) return;
      jumping_flag = true;
      force_jump_stop = false;
      el.classList.remove('mdi-arrow-down');
      add_loading_icon(el);
      jump_to_end();
    }
  });
}
