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
function add_jump_arrows() {
  var button_br = document.createElement('div');
  button_br.innerHTML = `<div class='fixed-br' title='Jump to Top'><i class='mdi-arrow-up mdi v-icon notranslate v-theme--dark v-icon--size-x-large text-white v-icon--clickable control-icon'></i></div>`;
  button_br.onclick = _ => { scrollToSmoothly(0) };
  document.body.prepend(button_br);
}
