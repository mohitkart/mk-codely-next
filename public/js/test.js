function load() {
  // const url = `https://app2.dazhboards.com/`
  const url = `http://localhost:3000/`
  const dazhApi = 'https://endpoint.dazhboards.com/'
  const facebookSvg = `<img src="${url}/assets/img/facebook_messenger.png" />`
  const instgramSVG = `<img src="${url}/assets/img/Instagram_icon.webp" />`
  const whatsappSVG = `<img src="${url}/assets/img/whatsApp.webp" />`
  
  const liveChatSVG = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 21000 21000" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xodm="http://www.corel.com/coreldraw/odm/2003"><path fill="currentColor" d="M4427.37 7165.26l0.12 0.31c21.75,45.26 41.89,91.44 60.35,138.47 619.02,1245.93 3114.75,1931.06 3621.9,1095.63 753.74,-1441.59 2263.14,-2425.59 4002.59,-2425.59 602.16,0 1176.63,118.2 1701.89,332.19l-0.77 -0.68c1716.41,555.85 3059.47,-1164.02 3059.47,-2847.34 0,-872.55 707.36,-1579.91 1579.91,-1579.91 872.53,0 1579.9,707.36 1579.9,1579.91 0,872.53 -707.35,1579.9 -1579.9,1579.9 -1344.71,0 -2964.8,1911.24 -2395.66,3254l-0.75 -0.67c362.92,650.11 569.97,1399.18 569.97,2196.67 0,728.12 -172.62,1415.82 -478.81,2024.81l0.59 -0.56c-529.15,1418.63 1656.95,3855.9 2908.36,3910.85 672.44,29.53 1218.79,545.69 1218.79,1218.79 0,673.11 -545.69,1218.78 -1218.79,1218.78 -673.1,0 -1214.28,-545.68 -1218.8,-1218.78 -8.71,-1302.38 -2566.99,-3549.3 -3984.18,-2987.91l0.37 -0.35c-535.89,224.35 -1124.25,348.42 -1741.59,348.42 -701.23,0 -1364.98,-160.09 -1957.02,-445.41l0.76 0.65c-2441.44,877.71 -2482.42,861.74 -2294.14,253.3l541.26 -1749.14 0.92 0.79c-492.66,-708.35 -787.59,-1564.58 -804.77,-2488.74 -11.47,-1053.06 -2585.61,-1668.16 -3710.05,-939.95 -49.5,41.27 -100.99,80.22 -154.27,116.76l-0.98 0.82 0.03 -0.17c-330.08,226.1 -729.44,358.44 -1159.73,358.44 -1134.91,0 -2054.93,-920.02 -2054.93,-2054.93 0,-1134.91 920.02,-2054.93 2054.93,-2054.93 816.33,0 1521.47,476.02 1853.03,1165.61l0 -0.04zm7684.95 2591.5c403.93,0 731.38,327.45 731.38,731.38 0,403.93 -327.45,731.38 -731.38,731.38 -403.93,0 -731.38,-327.45 -731.38,-731.38 0,-403.93 327.45,-731.38 731.38,-731.38zm2126.97 0c403.93,0 731.38,327.45 731.38,731.38 0,403.93 -327.45,731.38 -731.38,731.38 -403.93,0 -731.37,-327.45 -731.37,-731.38 0,-403.93 327.44,-731.38 731.37,-731.38zm-4276.81 0c403.93,0 731.38,327.45 731.38,731.38 0,403.93 -327.45,731.38 -731.38,731.38 -403.93,0 -731.38,-327.45 -731.38,-731.38 0,-403.93 327.45,-731.38 731.38,-731.38z"></path></svg>'
  const brandClass = 'dazh1'
  // create a new div element
  const newDiv = document.createElement("div");


  const createLink=({url=''})=>{
    let link = document.createElement("link");
    link.href = url
    link.rel = "stylesheet"
    return link
  }

  const style = document.createElement("style");
  style.setAttribute('type', 'text/css')
  style.append(`
  .${brandClass}-iconBtn{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    cursor:pointer;
}

.${brandClass}-iconBtn>*{
  width:100%;
}

.${brandClass}-iconBtn img{
    display: block;
    margin-left: auto;
    margin-right: auto;
    width:16px;
    height:16px;
    max-width: calc(100% - 10px);
    max-height: calc(100% - 10px);
}

.${brandClass}-iconBtn.${brandClass}-huge{
    min-height: 100px;
    min-width: 100px;
}

.${brandClass}-iconBtn.${brandClass}-large{
    min-height: 70px;
    min-width: 70px;
}

.${brandClass}-iconBtn.${brandClass}-medium{
    min-height: 60px;
    min-width: 60px;
}

.${brandClass}-iconBtn.${brandClass}-small{
    min-height: 50px;
    min-width: 50px;
}

.${brandClass}-popItem:not(:hover) .${brandClass}-menu-text{
  color: inherit !important;
}

.${brandClass}-btn-text{
    font-size: 12px;
    display: block;
    text-align: left;
    margin-top: 5px;
    text-align:center;
}

.${brandClass}-btn-text:empty{
  display:none;
}

.${brandClass}-btn-title{
    font-size: 14px;
    font-weight: 500;
    text-align: left;
}

.${brandClass}-btn-description{
    font-size: 12px;
    text-align: left;
}

.${brandClass}-flex{
    display: flex;
    column-gap: 5px;
}

  .${brandClass}-iconBtnP{
    position: fixed;
    right: 10px;
    bottom: 10px;
    z-index: 999999;
    display:inline-block;
  }
  .${brandClass}-iconBtnP.${brandClass}-left{
    right:initial;
    left:10px;
  }
  
  .${brandClass}-popoverP{
    position:absolute;
    right:0;
    bottom:100%;
  }

  .${brandClass}-popoverP.${brandClass}-left{
    right:initial;
    left:0;
  }

  .${brandClass}-popoverP.${brandClass}-left:after{
    right:initial;
    left:17px;
  }

  .${brandClass}-popover{
    display: inline-block;
    box-shadow: 0 0 6px #00000082;
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .${brandClass}-popover.${brandClass}-large .${brandClass}-popIcon{
    height: 50px;
    width: 50px;
  }

  .${brandClass}-popover.${brandClass}-medium .${brandClass}-popIcon{
    height: 40px;
    width: 40px;
  }

  .${brandClass}-popover.${brandClass}-large .${brandClass}-popItem{
    font-size: 15px;
  }

  .${brandClass}-popover.${brandClass}-medium .${brandClass}-popItem{
    font-size: 14px;
  }

  .${brandClass}-popItem{
    font-size:12px;
    display: flex;
    align-items: center;
    column-gap: 10px;
    padding: 6px 10px;
    cursor: pointer;
  }

  .${brandClass}-popItem:not(:hover){
    background-color: transparent !important;
  }

  .${brandClass}-item-border-solid .${brandClass}-popItem{
    border-bottom: 1px;
    border-style: solid;
  }

  .${brandClass}-item-border-dashed .${brandClass}-popItem{
    border-bottom: 1px;
    border-style: dashed;
  }

  .${brandClass}-popIcon{
    display:inline-flex;
    height:30px;
    width:30px;
  }

  .${brandClass}-popIcon svg{
    width: 100%;
    height: 100%;
  }

  .${brandClass}-popIcon img{
    height: calc(100% - 5px);
    width: calc(100% - 5px);
    display: block;
    object-fit: contain;
    margin: auto;
  }

  .${brandClass}-item-filled .${brandClass}-popIcon{
    padding: 5px;
    border-radius: 50%;
    color: #ffff;
    background-color: #000000;
  }

  .${brandClass}-item-outlined .${brandClass}-popIcon{
    padding: 5px;
    border-radius: 50%;
    color: #000000;
    border:1px solid #000000;
  }

  .${brandClass}-popover:after {
    display: inline-block !important;
    border-right: 8px solid transparent;
    border-top: 8px solid var(--${brandClass}-popup-bg);
    border-left: 8px solid transparent;
    border-top-color: var(--${brandClass}-popup-bg);
    bottom: -8px;
    right: 17px;
    position:absolute;
    content: '';
    }

    .${brandClass}-hide{
        display:none;
    }
  `)

  newDiv.className = `${brandClass}-ChatDiv`
  newDiv.id = `${brandClass}-ChatDiv`
  newDiv.innerHTML = ''

  var IP;
  var location;
  var config={};

  fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        IP = data.ip
        console.log('Your IP address is', IP);
        localStorage.setItem('IP', IP)
        displayHtml()
      })
      .catch(error => console.error('Error fetching IP address:', error));

// Check if the browser supports geolocation
if ("geolocation" in navigator) {
  // Get the current position of the user
  navigator.geolocation.getCurrentPosition(
    function (position) {

     
      location={lat:position.coords.latitude,lng:position.coords.longitude}
      console.log("location: ", location);
      localStorage.setItem('dazhLocation',JSON.stringify(location))
      // You can use the latitude and longitude values as needed
      displayHtml()
    },
    function (error) {
      console.error("Error getting geolocation: ", error.message);
    }
  );
} else {
  console.error("Geolocation is not supported by this browser");
}


  const datePipe=(p)=>{
    const monthArray = [
      { value: 'Jan',name:'January', id: 0 },
      { value: 'Feb',name:'February', id: 1 },
      { value: 'Mar',name:'March', id: 2 },
      { value: 'Apr',name:'April', id: 3 },
      { value: 'May',name:'May', id: 4 },
      { value: 'Jun',name:'Jun', id: 5 },
      { value: 'Jul',name:'July', id: 6 },
      { value: 'Aug',name:'Auguest', id: 7 },
      { value: 'Sep',name:'September', id: 8 },
      { value: 'Oct',name:'October', id: 9 },
      { value: 'Nov',name:'November', id: 10 },
      { value: 'Dec',name:'December', id: 11 }
  ]

  const monthfind = (id) => {
    let value = 0
    let ext = monthArray.find(itm => itm.id === id)
    if (ext) value = ext.value
    return value
}

let d=new Date(p)

return `${d.getDate()}-${monthfind(d.getMonth())}-${d.getFullYear()}`
  }

  const timePipe=(p)=>{
    return new Date(p).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }
  const datetimePipe=(p)=>{
    return `${datePipe(p)} ${timePipe(p)}`
  }

  const displayHtml = (f = config) => {
    let roomId = '';
    let userId = localStorage.getItem(`${brandClass}-userId`) || ''
    if (!userId) {
      userId = new Date().getTime()
      localStorage.setItem(`${brandClass}-userId`, userId)
    }

    let form = {
      buttonStyle: '',
      colorTheme: '#5d62df',
      size: '',
      radius: 0,
      iconSize: 16,
      position: '',
      xAxis: 0,
      yAxis: 0,
      iconText: '',
      title: '',
      description: '',
      label: '',
      menuSize: '',
      menuWidth: 200,
      menuIconStyle: '',
      menuBorder: '',
      menuBorderColor: '#5d62df',
      menuIconColor: '#5d62df',
      menuBackground: '#ffffff',
      menuTitleColor: '#000000',
      hoverItemBg: '#5d62df',
      hoverItemTitleColor: '#000000',
      menuShadowSize: 0,
      menuShadowOpacity: 0,
      ...f
    }
    let receiverId = form?.user_id?._id || ''

    style.append(`:root {
    --${brandClass}-popup-bg:${form.menuBackground};
    }`)

    let chats = []

    const getChats = () => {
      const cb = newDiv.querySelectorAll(`#${brandClass}-chatBody`)[0]
      let cbhtml = ''
      chats.map(itm => {
        if (itm.sender!=userId) {
          cbhtml += `<div class="dazh-chatItem dazh-chatItem-left">
          <img class="dazh-chatItem-img" src="${`${url}assets/img/dummy-profile.jpg`}" />
          <div class="dazh-chatItem-text">
          ${itm.content}
          <div class="dazh-time">${datetimePipe(itm.createdAt)}</div>
          </div>
          </div>`
        } else {
          cbhtml += `<div class="dazh-chatItem dazh-chatItem-right">
          <div class="dazh-chatItem-text">
          ${itm.content}
          <div class="dazh-time">${datetimePipe(itm.createdAt)}</div>
          </div>
          <img class="dazh-chatItem-img" src="${`${url}assets/img/dummy-profile.jpg`}" />
          </div>`
        }

      })
      cb.innerHTML = cbhtml
      chatScroll()
    }

    const chatScroll = () => {
      setTimeout(() => {
        const chatBox = newDiv.querySelectorAll(`#${brandClass}-chatBody`)[0]
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 100)
    }

    const items = [
      { id: 'facebookB', icon: facebookSvg, name: 'Facebook' },
      { id: 'instagram', icon: instgramSVG, name: 'Instagram' },
      { id: 'liveChat', icon: liveChatSVG, name: 'Live Chat' },
      { id: 'whatsappChat', icon: whatsappSVG, name: 'Whatsapp' },
    ]


    const liveChat = `
    <div class="dazh-chatWindow ${brandClass}-hide" id="${brandClass}-chatWindow">
    <div class="dazh-chatHeader">Live Chat
    <i class="fa fa-times dazh-chatHeaderIcon" id="${brandClass}-chatWindowClose"></i>
    </div>
    <div class="dazh-chatBody" id="${brandClass}-chatBody"></div>

    <form class="dazh-chatFooter" id="${brandClass}-chatform">
    <input type="text" id="${brandClass}-chatFooterInput" placeholder="Type your message here" class="dazh-chatFooterInput" />

    <!-- <i class="fa fa-paperclip dazh-chatFooterAction dazh-ml-auto" title="Upload"></i> -->
    <i id="${brandClass}-chatsubmit" class="fa fa-paper-plane dazh-chatFooterAction" title="Send"></i>
    
    </form>

    </div>
    `


    let mainHtml = `
    <div 
    class="${brandClass}-iconBtnP ${brandClass}-${form.position || 'right'}" 
    style="
            margin-left:${form.position == 'right' ? `initial` : `${form.xAxis}px`};
            margin-right:${form.position == 'right' ? `${form.xAxis}px` : `initial`};
            margin-bottom:${`${form.yAxis}px`};
          "
    >
    <div 
    class="${`${brandClass}-iconBtn ${brandClass}-${form.buttonStyle || 'regular'} ${brandClass}-${form.size || 'small'} ${brandClass}-${form.position || 'right'}`}"
    title=${`${form.label || 'Dazhboards'}`}
    style="
      background:${form.buttonStyle == 'no-background' ? 'initial' : `${form.colorTheme}`};
      color:${form.buttonStyle == 'no-background' ? `${form.colorTheme}` : `#ffffff`};
      border-radius:${`${form.radius}%`};
    "
    id="${brandClass}-iconBtn"
    >
      <div>
        <div class="${brandClass}-flex">
        <img src="${url}img/logo.png"
        style="
          height:${`${form.iconSize}px`};
          width:${`${form.iconSize}px`};
          object-fit:contain;
        "
        />
        <div>

         <div class="${brandClass}-btn-title">${form.title}</div>
         <div class="${brandClass}-btn-description">${form.description}</div>
        </div>
        </div>
      
        <span class="${brandClass}-btn-text">${form.iconText}</span>
      </div>
    </div>



  
    <div  
    bgcolor="${form.menuBackground || '#ffffff'}"
    class="${`${brandClass}-popover ${brandClass}-popoverP ${brandClass}-hide ${brandClass}-${form.position || 'right'} ${brandClass}-${form.menuSize || 'small'} ${brandClass}-item-${form.menuIconStyle || 'filled'} ${brandClass}-item-border-${form.menuBorder || 'none'} `}" id="${brandClass}-popover"
                style="
                  min-width:${`${form.menuWidth}px`};
                  background-color:${form.menuBackground || '#ffffff'};
                  box-shadow:0 0 ${form.menuShadowSize}px rgba(0,0,0,${form.menuShadowOpacity == 100 ? '1' : '0.' + form.menuShadowOpacity});
                "
                >`


    items.map(itm => {
      mainHtml += `
                  <div class="${brandClass}-popItem" id="${brandClass}-${itm.id}"
                  style="
                    color:${form.menuTitleColor || '#000000'};
                    border-color:${form.menuBorderColor || '#ffffff'};
                    background-color:${form.hoverItemBg || 'transparent'};
                  "
                  >
                    <span class="${brandClass}-popIcon"
                      style="
                        color:${(!form.menuIconStyle || form.menuIconStyle == 'filled') ? '#ffffff' : (form.menuIconColor || '#000000')};
                        border-color:${(!form.menuIconStyle || form.menuIconStyle == 'filled') ? '#ffffff' : (form.menuIconColor || '#000000')};
                        background-color:${(!form.menuIconStyle || form.menuIconStyle == 'filled') ? (form.menuIconColor || '#000000') : 'transparent'};
                      "
                    >
                    ${itm.icon}
                    </span>
                    <span
                    class="${brandClass}-menu-text"
                    style="
                      color:${form.hoverItemTitleColor || '#000000'};
                    "
                    >${itm.name}</span>
                  </div>
                  `
    })

    mainHtml += `
                </div>
                ${/*liveChat*/''}
                <div class="dazh-chatWindow ${brandClass}-hide" id="${brandClass}-chatWindow">
                <i class="fa fa-times dazh-chatHeaderIcon" id="${brandClass}-chatWindowClose"></i>
                <iframe src="${url}chat?userId=${userId}&location=${location?.lat},${location?.lng}&ip=${IP}" title="W3Schools Free Online Web Tutorials"></iframe>
                </div>
              </div>

    `;
    newDiv.innerHTML = mainHtml

    const btnEl = newDiv.querySelectorAll(`#${brandClass}-iconBtn`)[0]
    const fbBtnEl = newDiv.querySelectorAll(`#${brandClass}-facebookB`)[0]
    const waBtnEl = newDiv.querySelectorAll(`#${brandClass}-whatsappChat`)[0]
    const lcBtnEl = newDiv.querySelectorAll(`#${brandClass}-liveChat`)[0]

    const popEl = newDiv.querySelectorAll(`#${brandClass}-popover`)[0]
    const cwpEl = newDiv.querySelectorAll(`#${brandClass}-chatWindow`)[0]
    const cwcpEl = newDiv.querySelectorAll(`#${brandClass}-chatWindowClose`)[0]

    const chatForm = newDiv.querySelectorAll(`#${brandClass}-chatform`)[0]
    const chatInput = newDiv.querySelectorAll(`#${brandClass}-chatFooterInput`)[0]
    const chatSubmit = newDiv.querySelectorAll(`#${brandClass}-chatsubmit`)[0]

    btnEl.onclick = () => {
      popEl.classList.toggle(`${brandClass}-hide`)
    }

    fbBtnEl.onclick = () => {
      // console.log("form",form)
      window.open(`http://m.me/${form.user_id.facebook_page_id || ''}`, '_blank')
    }

    waBtnEl.onclick = () => {
      // console.log("form",form)
      if(form.user_id.whatsappNo) window.open(` https://wa.me/${form.user_id.whatsappNo || ''}`, '_blank')
      
    }


    lcBtnEl.onclick = () => {
      popEl.classList.toggle(`${brandClass}-hide`)
      btnEl.classList.toggle(`${brandClass}-hide`)
      cwpEl.classList.toggle(`${brandClass}-hide`)
    }

    cwcpEl.onclick = () => {
      btnEl.classList.toggle(`${brandClass}-hide`)
      cwpEl.classList.toggle(`${brandClass}-hide`)
    }

    const onSubmit=()=>{
      let message = chatInput.value
      let payload = {
        media: [],
        room_id: roomId,
        ip:IP,
        "type": "TEXT",
        "sender": userId,
        "receiver": receiverId,
        "content": message
      }
      // socket.emit('send-message', payload);
      chatInput.value = ''
    }

    chatForm.onsubmit = (e) => {
      e.preventDefault()
      onSubmit()
    }

    chatSubmit.onclick = () => {
      onSubmit()
    }
  }


  document.body.append(style);
  document.body.append(createLink({url:'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'}));
  document.body.append(createLink({url:`${url}css/chat.css`}));
  document.body.append(newDiv);


  const setDetail = (p) => {
    if (p.id) {
      config=p
      displayHtml()
    }
  }

  const dazhChat = {
    set: setDetail
  }

  window.dazhChat = dazhChat
}

load()