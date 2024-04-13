
class page extends HTMLElement {
    constructor() {
        super();
        //this.attachShadow({ mode: 'open' });
        this.props=this.getAttribute("x-props")
        
    }
    connectedCallback(){
        this.render()
    }
    render(){
        let content= `
        <style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;
    width: 80vw;
  }
  .infos {
    display: grid;
    grid-template-columns: 40% 59%;
    grid-gap: 10px;
  }
  .players {
    display: grid;
    gap: 2px;
  }
  .player span {
    font-size: 3rem;
  }
  .player {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: black;
    color: white;
    border-radius: 20px;
    padding: 8px;
  }

  /*Chat*/
  .chat {
    overflow: hidden;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
    background: var(--primary);
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .messages {
    flex: 1 1 auto;
    color: black;
    overflow: hidden;
    position: relative;
    width: 100%;
    min-height: 50vh;
  }
  .messages .messages-content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
  .messages-content {
    overflow-y: scroll;
    padding: 2px;
  }
  .messages .message {
    clear: both;
    float: left;
    padding: 6px 10px 7px;
    border-radius: 10px 10px 10px 0;
    background: white;
    margin: 8px 0;
    font-size: 11px;
    line-height: 1.4;
    position: relative;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  }
  .received {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .avatar {
    font-size: 30px;
    border: 2px solid rgba(255, 255, 255, 0.24);
    border-radius: 30px;
    background-color: orange;
    padding: 5px;
  }
  .messages .message .timestamp {
    bottom: -15px;
    font-size: 9px;
    color: rgba(255, 255, 255, 0.3);
    text-align: right;
  }
  .messages .message::before {
    content: "";
    position: absolute;
    bottom: -6px;
    border-top: 6px solid white;
    left: 0;
    border-right: 7px solid transparent;
  }
  .messages .message.message-personal {
    float: right;
    color: var(--white);
    background: var(--tertiary);
    border-radius: 10px 10px 0 10px;
  }
  .messages .message.message-personal::before {
    left: auto;
    right: 0;
    border-right: none;
    border-left: 5px solid transparent;
    border-top: 4px solid var(--tertiary);
    bottom: -4px;
  }
  .messages .message:last-child {
    margin-bottom: 30px;
  }
  .messages .message.new {
    transform-origin: 0 0;
    animation: bounce 500ms linear both;
    white-space: pre-wrap;
    max-width: 70%;
    word-wrap: break-word;
  }
  .message-box {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    background: rgba(0, 0, 0, 0.3);
  }
  .message-box .message-input {
    border-radius: 10px;
    background-color: var(--primary);
    outline: none !important;
    resize: none;
    color: var(--white);
    width: 80%;
    margin: 4px;
  }
  .message-box textarea:focus:-webkit-placeholder {
    color: transparent;
  }
  .message-box .message-submit {
    border-radius: 10px;
    padding: 5px;
    height: 70%;
  }
  .message-box .message-submit:hover {
    background: orange;
  }
  /*-------------------- Custom Srollbar --------------------*/
  ::-webkit-scrollbar {
    width: 3px;
    border-radius: 10px;
    /* Largeur de la scrollbar */
  }
  ::-webkit-scrollbar-thumb {
    background: orange;
    /* Couleur de fond du thumb de la scrollbar */
  }
  ::-webkit-scrollbar-thumb:hover {
    background: white;
    /* Couleur de fond du thumb de la scrollbar au survol */
  }
  /*Counter*/
  .counter {
    display: flex;
    justify-content: center;
  }
  .counter-box {
    display: grid;
    height: 10%;
    width: 15%;
    text-align: center;
    border: solid 5px orange;
    border-radius: 5px;
    background-color: black;
  }
  .chrono {
    font-size: 2rem;
    color: white;
    display: block;
    padding: 10px;
  }
  .beat {
    animation: beat 1s;
    animation-iteration-count: infinite;
  }
  @keyframes beat {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.5);
    }
  }
</style>
<main
  x-data="{emojis:[
    { name: '😁', selected: false },
    { name: '😡', selected: false },
    { name: '😱', selected: false },
    { name: '😎', selected: false },
    { name: '👽', selected: false },
    { name: '🤯', selected: false },
    { name: '😈', selected: false },
    { name: '💩', selected: false },
    { name: '🥸', selected: false },
    { name: '🤠', selected: false },
    { name: '🤖', selected: false },
    { name: '🤡', selected: false }
  ],
  namePlayer:'',
  selectedemoji:'',
  errorform:'',
  isconecte:false,
  players:[],
  messages:[],
  inputData : '',
  currentP:'',
  timer:0,
  isListening:true,
  isOpen: true,
  ws:''
}"
>
  <div class="player-settings" x-if="!$isconecte">
    <p x-text="$errorform" style="color: red"></p>
    <input type="text" placeholder="Player Name" x-model="$namePlayer" />
    <p>Select your player</p>
    <div class="select-emoji-container" x-for="emojiItem, key in $emojis">
      <div
        class="emoji-select-wrapper"
        @click="
          $emojis = [...$emojis.map((v, i) => key === i ? ({...v, selected: true}) : ({...v, selected: false}) )]
          $selectedemoji=emojiItem.name
          "
      >
        <div class="select-emoji selected" x-if="emojiItem.selected">
          <span x-text="emojiItem.name"></span>
          <div class="sun">
            <div class="ray"></div>
            <div class="ray"></div>
            <div class="ray"></div>
          </div>
        </div>
        <div class="select-emoji" x-else>
          <span x-text="emojiItem.name"></span>
        </div>
      </div>
    </div>
    <button
      id="starttest"
      @click="
            if($namePlayer && $selectedemoji){
              let player={
                nickname: $namePlayer,
                emoji:$selectedemoji
              }
              if ($isListening) {
                window.ws = new WebSocket('ws://localhost:8080');
                $ws= window.ws
        
                $ws.addEventListener('open', () => {
                  console.log('Connected to server',player);
                  $isListening=false
                  $ws.send(JSON.stringify({
                      type: 'create-player',
                      payload: player
                    }))
                });
                $ws.onmessage = function(event) {
                  let data=JSON.parse(event.data)
                  if (data?.type ==='create-successfully') {
                    $isconecte=true
                    $messages=data?.payload?.messages|| []
                    window.currentPId=data?.payload?.id
                    $currentP=data?.payload?.id
                  }else if (data?.type ==='chat'){
                    console.log('new message',data?.payload);
                    $messages=[...data?.payload?.messages] || []
                    
                  }else if (data?.type ==='new-player'){
                    $players=data?.payload?.players
                    console.log('new player',$players);
                    
                  }else if (data?.type ==='timer'){
                    $timer=data?.payload?.timer
                    console.log('timer',$timer);
                    
                  }else
                  $ws=null
                  $errorform=data?.payload
                  console.log($errorform);
                  
                };
              }
            }else{
              $errorform='A name and a emoji is needed'
            }

        "
    >
      Start
    </button>
  </div>

  <div class="container" x-else>
    <div class="counter">
      <div class="">
        <span x-text="$timer"></span>
      </div>
    </div>
    <div class="infos">
      <div class="players" x-for="playerItem, key in $players">
        <div class="player">
          <span x-text="playerItem.avatar"></span>
          <p x-text="playerItem.nickname"></p>
        </div>
      </div>
      <div class="chat">
        <div class="messages">
          <div class="messages-content" 
          x-for="messagePlayer, key in $messages"
          >
            <div class="received" x-if="messagePlayer.player.access!== $currentP" >
              <span class="avatar"  x-text="messagePlayer.player.avatar"></span>
              <div class="message new" >
                <span x-text="messagePlayer.content"></span>
                <div class="sender">by @<span x-text="messagePlayer.player.nickname"></span></div>
              </div>
            </div>
            <div class="message new message-personal" x-else>
              <span class="avatar" x-text="messagePlayer.player.avatar"></span>
              <div class="message new">
                <span x-text="messagePlayer.content"></span>
                <div class="sender">by @ <span x-text="messagePlayer.player.nickname"></span></div>
              </div>
            </div>
          </div>
        </div>
        <div class="message-box">
          <input
            type="text"
            value=""
            class="message-input"
            placeholder="Type message..."
            x-model="$inputData"
           
          />
          <button type="submit" class="message-submit" @click="
          
          let message={
                content: $inputData,
                userId:$currentP
              }
              console.log('message to send',message);
              $ws.send(JSON.stringify({
                  type: 'chat',
                  payload: message
              }))
          ">Send</button>
        </div>
      </div>
    </div>
  </div>
</main>
        `;
        
        this.innerHTML=content
    }
}
customElements.define('hub-page', page);
    
class Roompage extends HTMLElement {
    constructor() {
        super();
        //this.attachShadow({ mode: 'open' });
        this.props=this.getAttribute("x-props")
        
    }
    connectedCallback(){
        this.render()
    }
    render(){
        let content= `
        <style>

.container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;
    width: 80VW;
}
.infos{
    display: grid;
    grid-template-columns:  40% 59%;
    grid-gap: 10px
}
.players {
    display: grid;
    gap: 2px;
}
.player span {
    font-size: 3rem;
}
.player {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: black;
    color: white;
    border-radius: 20px;
    padding: 8px;
}
/*Chat*/
.chat {
    overflow: hidden;
    box-shadow: 0 5px 30px rgba(0, 0, 0, .2);
    background: var(--primary);
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}
.messages {
    flex: 1 1 auto;
    color: black;
    overflow: hidden;
    position: relative;
    width: 100%;
}
.messages .messages-content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
.messages-content {
    overflow-y: scroll;
    padding: 2px;
}
.messages .message {
    clear: both;
    float: left;
    padding: 6px 10px 7px;
    border-radius: 10px 10px 10px 0;
    background: white;
    margin: 8px 0;
    font-size: 11px;
    line-height: 1.4;
    position: relative;
    text-shadow: 0 1px 1px rgba(0, 0, 0, .2);
}
.messages .message .timestamp {
    bottom: -15px;
    font-size: 9px;
    color: rgba(255, 255, 255, .3);
    text-align: right;
}
.messages .message::before {
    content: '';
    position: absolute;
    bottom: -6px;
    border-top: 6px solid rgba(0, 0, 0, .3);
    left: 0;
    border-right: 7px solid transparent;
}
.messages .message .avatar img {
    width: 100%;
    height: auto;
}
.messages .message.message-personal {
    float: right;
    color: var(--white);
    background: var(--tertiary);
    border-radius: 10px 10px 0 10px;
}
.messages .message.message-personal::before {
    left: auto;
    right: 0;
    border-right: none;
    border-left: 5px solid transparent;
    border-top: 4px solid var(--tertiary);
    bottom: -4px;
}
.messages .message:last-child {
    margin-bottom: 30px;
}
.messages .message.new {
    transform: scale(0);
    transform-origin: 0 0;
    animation: bounce 500ms linear both;
    white-space: pre-wrap;
    max-width: 70%;
    word-wrap: break-word;
}
.message-box {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    background: rgba(0, 0, 0, 0.3);
}
.message-box .message-input {
    border-radius: 10px;
    outline: none !important;
    resize: none;
    color: var(--white);
    width: 80%;
    margin: 4px;
}
.message-box textarea:focus:-webkit-placeholder {
    color: transparent;
}
.message-box .message-submit {
    border-radius: 10px;
    padding: 5px;
    height: 70%;
}
.message-box .message-submit:hover {
    background: orange;
}
/*-------------------- Custom Srollbar --------------------*/
::-webkit-scrollbar {
    width: 3px;
    border-radius: 10px;
    /* Largeur de la scrollbar */
}
::-webkit-scrollbar-thumb {
    background: orange;
    /* Couleur de fond du thumb de la scrollbar */
}
::-webkit-scrollbar-thumb:hover {
    background: white;
    /* Couleur de fond du thumb de la scrollbar au survol */
}
/*Counter*/
.counter{
    display: flex;
    justify-content: center;
}
.counter-box {
    display: grid;
    height: 10%;
    width: 15%;
    text-align: center;
    border: solid 5px orange;
    border-radius: 5px;
    background-color: black;
}
.chrono {
    font-size: 2rem;
    color: white;
    display: block;
    padding: 10px;
}
.beat {
    animation: beat 1s;
    animation-iteration-count: infinite;
}
@keyframes beat {
    from {
        transform: scale(1);
    }
    to {
        transform: scale(1.5);
    }
}
</style>


<div class="container">
  <div class="counter">
      <div class="counter-box">
          <span class="chrono" id="chrono">20</span>
      </div>
  </div>
  <div class="infos">
      <div class="players" x-for="playerItem, key in players">
          <div class="player">
              <span x-text="playerItem.emoji"></span>
              <p x-text="playerItem.nickname"></p>
          </div>
          
      </div>
      <div class="chat">
          <div class="messages">
              <div class="messages-content">
               <div class="message">
                    <p class="emoji"></p>
                    <h3></h3>
               </div>

              </div>
          </div>
          <div class="message-box">
              <input type="text"value="" class="message-input" placeholder="Type message..." x-model="$inputData" 
              @keyup.enter="
                let message={
                  content: $inputData,
                  userId:window.currentPId
                }
                window.ws.send(JSON.stringify({
                    type: 'chat',
                    payload: message
                }))"
              />
              <!-- <button type="submit" class="message-submit">Send</button> -->
          </div>
      </div>
  </div>
</div>
        `;
        
        this.innerHTML=content
    }
}
customElements.define('hub-roompage', Roompage);
    
export default class Router extends HTMLElement {
    constructor() {
        super()
        /** @type {Route[]} */
        this.routes = [
        
        {
            name: 'hub-page',
            hash: '/',
            regExp: new RegExp(/^#\/$/)
        }
                ,
        {
            name: 'hub-roompage',
            hash: '/room',
            regExp: new RegExp(/^#\/room$/)
        }
                
            // 404 Page not found
            ,{
                name: 'Hub-404',
                hash:'#/404',
                regExp: new RegExp(/^#\/404$/)
            },
        ]
        this.previousRoute = this.routes[0]
        /**
         * Listens to hash changes and forwards the new hash to route
         */
        this.hashChangeListener = event => {
            this.previousRoute = this.route(location.hash, false, event.newURL === event.oldURL)
            window.hubble.start()
        }
    }
    connectedCallback() {
        self.addEventListener('hashchange', this.hashChangeListener)
        this.previousRoute = this.route(this.routes.some(route => route.regExp.test(location.hash)) ? location.hash : '#/', true)
    }
    disconnectedCallback() {
        self.removeEventListener('hashchange', this.hashChangeListener)
    }
    /**
     * route to the desired hash/domain
     *
     * @param {string} hash
     * @param {boolean} [replace = false]
     * @param {boolean} [isUrlEqual = true]
     * @return {Route}
     */
    route(hash, replace = false, isUrlEqual = true) {
        // escape on route call which is not set by hashchange event and trigger it here, if needed
        if (location.hash !== hash) {
            if (replace) location.replace(hash);
            return this.previousRoute
        }
        let route
        // find the correct route or do nothing
        if ((route = this.routes.find(route => route.regExp.test(hash)))) {
                if (this.shouldComponentRender(route.name, isUrlEqual)) {
                    // document.title = route.title
                    let component= document.createElement(route.name)
                    this.render(component)
                }
        } else {
            console.log("Not Found");
            self.location.hash = '#/404'
        }
        return route ? route : this.previousRoute
    }
    /**
     * evaluates if a render is necessary
     *
     * @param {string} name
     * @param {boolean} [isUrlEqual = true]
     * @return {boolean}
     */
    shouldComponentRender(name, isUrlEqual = true) {
        if (!this.children || !this.children.length) return true
        return !isUrlEqual || this.children[0].tagName !== name.toUpperCase()
    }
    /**
     * renders the page
     *
     * @param {HTMLElement} component
     * @return {void}
     */
    render(component) {
        // clear previous content
        this.innerHTML = ''
        this.appendChild(component)
    }
}
customElements.define('hub-router', Router);
window.hubble = {
  init: true,
  data: [],
  directives: {
    'x-text': (el, value) => {
      if (el.innerText !== `${value}`) {
        el.innerText = value;
      }
    },
    'x-bind': (el, value) => {
      const attrName = el.getAttributeNames().find(name => name.startsWith("x-bind:") || name.startsWith(":"));
      const actualAttrName = attrName.startsWith(":") ? attrName.substring(1) : attrName.substring(7);
      if (actualAttrName === 'checked') {
        if (value) el.setAttribute(actualAttrName, "");
      } else {
        el.setAttribute(actualAttrName, value);
      }
    },
    'x-model': (el, value, uuid) => {
      const key = el.getAttribute('x-model').replaceAll('$', '');
      if (el.type === 'checkbox') {
        el.checked = !!value;
      } else if (el.type === 'radio') {
        el.checked = (value === el.value);
      } else {
        if (el.value !== value) {
          el.value = value;
        }
      }

      if (hubble.init) {
        const updateData = (e) => {
          let newValue;
          if (el.type === 'checkbox') {
            newValue = el.checked;
          } else if (el.type === 'radio') {
            if (el.checked) {
              newValue = el.value;
            } else {
              return;
            }
          } else {
            newValue = e.target.value;
          }

          let parsedValue = typeof hubble.data[uuid][key] === 'number' ? parseFloat(newValue) : newValue;

          hubble.data[uuid][key] = parsedValue;
        };

        switch (el.tagName.toLowerCase()) {
          case "input":
            if (el.type === "checkbox" || el.type === "radio") {
              el.addEventListener("change", updateData);
            } else {
              el.addEventListener("input", updateData);
            }
            break;
          case "select":
          case "textarea":
            el.addEventListener("input", updateData);
            break;
        }
      }
    },
    'x-if': (el, value) => {
      const nextSibling = el.nextElementSibling;

      if (!value) {
        el.setAttribute("style", "display: none !important");;
        if (nextSibling && nextSibling.getAttribute('x-else') !== null) {
          nextSibling.removeAttribute("style");
        }
      } else {
        el.removeAttribute("style");
        if (nextSibling && nextSibling.getAttribute('x-else') !== null) {
          nextSibling.setAttribute("style", "display: none !important");;
        }
      }
    },
    "x-for": (el, value, uuid, key) => {
      let [item, array] = value.split(' in ');
      if (key === "$" && hubble.init) key = array
      if (key !== array) return false;

      let template;
      if (hubble.init) {
        template = el.innerHTML;
        el.setAttribute('x-temp', template);
      } else {
        template = el.getAttribute('x-temp');
      }

      const withIndex = item.split(', ');
      if (withIndex.length === 2) {
        item = item.split(', ')[0];
      }
      el.innerHTML = '';

      const _array = array.replaceAll('$', '');
      hubble.data[uuid][_array].forEach((_, index) => {
        const templateInstance = document.createElement('template');
        let html = template.replaceAll(new RegExp(item, 'g'), `${array}[${index}]`);
        if (withIndex.length === 2) {
          html = html.replaceAll(new RegExp(withIndex[1], 'g'), `${index}`);
        }
        templateInstance.innerHTML = html;
        const content = templateInstance.content.cloneNode(true);
        el.appendChild(content);
      });

      return true;
    }
  },
  start() {
    this.data = []
    this.init = true
    const dataElements = document.querySelectorAll('[x-data]');

    dataElements.forEach((element) => {
      const dataString = element.getAttribute('x-data');
      const dataObject = eval(`(${dataString})`);
      this.initializeComponent(element, dataObject);
    });
    this.init = false;
  },
  initializeComponent(container, data) {
    const uuid = createUUID();
    const proxyData = new Proxy(({ ...data, uuid }), {
      set: (target, key, value) => {
        target[key] = value;
        hubble.updateDOM(container, target.uuid, '$' + key);
        return true;
      }
    });
    hubble.data[uuid] = proxyData;
    this.updateDOM(container, uuid);
  },
  updateDOM(container, uuid, key = "$") {
    let shouldRemountEvent = false;
    this.walkDom(container, (el) => {
      for (const attr of el.attributes) {
        let { name, value } = attr;
        if (name.startsWith('x-bind') || name.startsWith(':')) {
          const _value = value.replaceAll('$', 'hubble.data[uuid].')
          this.directives['x-bind'](el, eval(_value), uuid)
        } else if (name.startsWith('x-for')) {
          shouldRemountEvent = this.directives['x-for'](el, value, uuid, key)
        } else if (Object.keys(this.directives).some((k) => name.startsWith(k))) {
          const _value = value.replaceAll('$', 'hubble.data[uuid].')
          this.directives[name](el, eval(_value), uuid)
        } else if ((this.init || shouldRemountEvent) && name.startsWith('@')) {
          const keyEventMatch = name.match(/^@(keydown|keyup)(\.[a-zA-Z]+)*$/);
          if (keyEventMatch) {
            const modifiers = keyEventMatch[2] ? keyEventMatch[2].split('.').slice(1) : [];
            const event = keyEventMatch[1];

            el.addEventListener(event, (e) => {
              const isKeyPressed = modifiers.every(modifier => e.key === `${modifier.charAt(0).toUpperCase() + modifier.slice(1).toLowerCase()}`);

              if (isKeyPressed) {
                const _value = el.getAttribute(name).replaceAll('$', 'hubble.data[uuid].')
                eval(_value);
              }
            });
          } else {
            const event = name.substring(1);
            const _value = value.replaceAll('$', 'hubble.data[uuid].')
            if (!el.hasAttribute('data-event-fired')) {
              function handler(e) {
                eval(_value);
              };
              el.addEventListener(event, handler)
              el.setAttribute('data-event-fired', 'true')
            } 
          }
        }
      }
    })
  },
  walkDom(el, callback) {
    callback(el);

    el = el.firstElementChild;

    while (el) {
      this.walkDom(el, callback);
      el = el.nextElementSibling;
    }
  },
}

const createUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

window.hubble.start()

function triggerDivLoadedEvent(div) {
  var event = new CustomEvent('divLoaded', {
      bubbles: true,  
      detail: { 
          message: 'Le div est chargé !'
      }
  });
  console.log("div load",event)
  div.dispatchEvent(event); 
}