
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
        <a href="#/room">room</a>
<div
  class="player-settings" 

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
  errorform:''
  }"
>
  <p  x-text="$errorform" style="color: red;" 
  @readystatechange="
 console.log("alpapie");
"
  ></p>
    <input type="text" placeholder="Player Name" x-model="$namePlayer"/>
    <p >Select your player</p>
    <div class="select-emoji-container" x-for="emojiItem, key in $emojis">
      <div class="emoji-select-wrapper" @click="
      $emojis = [...$emojis.map((v, i) => key === i ? ({...v, selected: true}) : ({...v, selected: false}) )]
      $selectedemoji=emojiItem.name
      " >
        <div class="select-emoji selected" x-if="emojiItem.selected"><span x-text="emojiItem.name"></span>
            <div class="sun">
                <div class="ray"></div>
                <div class="ray"></div>
                <div class="ray"></div>
            </div>
        </div>
        <div class="select-emoji" x-else ><span x-text="emojiItem.name"></span></div>
      </div>
    </div>
    <button id="starttest" @click="
        let player={
           name: $namePlayer,
           emoji:$selectedemoji
        }
        window.ws = new WebSocket('ws://localhost:8080');

        window.ws.onopen = function(event) {
        console.log('Connected to server',player);
        window.ws.send(JSON.stringify({
            type: 'new-user',
            payload: player
          }))
      };
      window.ws.onmessage = function(event) {
        let data=JSON.parse(event.data)
        if (data?.type ==='create-successfully') {
          location.hash='#/room'
          window.ws.onmessage =null
          return
        }
        $errorform='connection error'
      };

    ">Start</button>
</div>
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
    @import url("https://fonts.googleapis.com/css2?family=Baloo+Paaji+2:wght@400;500&display=swap");

.container {
  display: grid;
  grid-template-columns: 300px 300px 300px;
  grid-gap: 50px;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Baloo Paaji 2', cursive;
}

.card {
  background-color: #222831;
  height: 17rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.7);
  color: white;
  cursor: pointer;
}

.card__name {
  margin-top: 15px;
  font-size: 1.5em;
}

.card__image {
  height: 160px;
  width: 160px;
  border-radius: 50%;
  border: 5px solid #272133;
  margin-top: 20px;
  box-shadow: 0 10px 50px rgba(235, 25, 110, 1);
}
</style>

<div class="container" 
x-data="{
    player: window.ws
}
">
<p x-text="$player" @readystatechange="
 console.log("alpapie");
" ></p>
    <div class="card">
      <img src="https://lh3.googleusercontent.com/ytP9VP86DItizVX2YNA-xTYzV09IS7rh4WexVp7eilIcfHmm74B7odbcwD5DTXmL0PF42i2wnRKSFPBHlmSjCblWHDCD2oD1oaM1CGFcSd48VBKJfsCi4bS170PKxGwji8CPmehwPw=w200-h247-no" alt="Person" class="card__image">
      <p class="card__name" >Lily-Grace Colley</p>
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
            if(window?.hubble){
                window.hubble.start()
            }
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
            return this.previousRoutewindow.hubble.start()
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
            el.addEventListener(event, (e) => {
              eval(_value)
            })
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
