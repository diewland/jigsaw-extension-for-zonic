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
function add_loading_icon(el) {
  el.classList.add('mdi-cog');
  el.classList.add('mdi-spin');
}
function remove_loading_icon(el) {
  el.classList.remove('mdi-cog');
  el.classList.remove('mdi-spin');
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
        find('.search-result-item.active', o => o.parentElement.click());
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
