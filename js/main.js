const menuButton = document.querySelector('[data-menu-all-buttons]')
const menuTop = document.querySelector('[data-menu-top]')
const menuLeft = document.querySelector('[data-menu-left]')
const menuRight = document.querySelector('[data-menu-right]')
const menuBottom = document.querySelector('[data-menu-bottom]')
const menus = document.querySelectorAll('.menu')

menuButton.onclick = () => {
    menus.forEach(menu => {
        menu.classList.toggle('active')
    })
}

/* ----- custom color ----- */
let LOCAL_STORAGE_KEY = 'mm004.customHSLA.key'
let customHSLA = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [] 

const hueText = document.querySelector('[data-H-text]')
const hueRange = document.querySelector('[data-range-H]')
const saturationText = document.querySelector('[data-S-text]')
const saturationRange = document.querySelector('[data-range-S]')
const lightText = document.querySelector('[data-L-text]')
const lightRange = document.querySelector('[data-range-L]')
const alphaText = document.querySelector('[data-A-text]')
const alphaRange = document.querySelector('[data-range-A]')
const allRanges = document.querySelectorAll('.ranges input[type="range"]')

let H = hueRange.value;
let S = saturationRange.value;
let L = lightRange.value;
let A = alphaRange.value;

const renderRange = () => {
    hueRange.value = customHSLA[0];
    hueText.innerText = hueRange.value
    saturationRange.value = customHSLA[1];
    saturationText.innerText = saturationRange.value
    lightRange.value = customHSLA[2];
    lightText.innerText = lightRange.value
    alphaRange.value = customHSLA[3];
    alphaText.innerText = alphaRange.value
    const customColorString = `hsla(${customHSLA[0]}, ${customHSLA[1]}%, ${customHSLA[2]}%, ${customHSLA[3]}%)`
    document.documentElement.style.setProperty('--customColor', customColorString)
}

renderRange()

allRanges.forEach(range => { range.oninput = () => { saveToLocalStorage(); } })

const saveToLocalStorage = () => {
    hueText.innerText = hueRange.value
    saturationText.innerText = saturationRange.value
    lightText.innerText = lightRange.value
    alphaText.innerText = alphaRange.value
    H = hueRange.value;
    S = saturationRange.value;
    L = lightRange.value;
    A = alphaRange.value;
    const customColor = [H, S, L, A]
    const customColorString = `hsla(${H}, ${S}%, ${L}%, ${A}%)`
    document.documentElement.style.setProperty('--customColor', customColorString)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customColor))
}

/* ---- Mandalas ----- */
const LOCAL_STORAGE_KEY_MANDALA = 'mm004.mandala';
let MANDALAS = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_MANDALA)) || [];

/* ---- Mandala ----- */

import { mandalaExample } from './mandala.js';

let MANDALA = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_MANDALA)) || mandalaExample;
console.log(MANDALA)

const resetMandala = () => {
    MANDALA = mandalaExample
    saveMandala()
}

const resetMandalaButton = document.querySelector('[data-mandala-reset-button]')
resetMandalaButton.onclick = () => {
    resetMandala()
    window.location.reload();
}

/* ----- Halo Ranges ----- */
const haloRadiusRange = document.querySelector('[data-halo-radius-range]')
const haloOrbitalsRange = document.querySelector('[data-halo-orbitals-range]')

const LOCAL_STORAGE_KEY_HALO_RADIUS = 'mm004.halo-radius';
const LOCAL_STORAGE_KEY_HALO_ORBITALS = 'mm004.halo-orbs';

let haloRadius = MANDALA.haloRadius
let haloOrbitals = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_HALO_ORBITALS)) || MANDALA.haloOrbs

haloRadiusRange.value = haloRadius;
haloOrbitalsRange.value = haloOrbitals;

haloOrbitalsRange.oninput = () => {
    haloOrbitals = haloOrbitalsRange.value;
    MANDALA.haloOrbitals = haloOrbitals;
    localStorage.setItem(LOCAL_STORAGE_KEY_HALO_ORBITALS, JSON.stringify(haloOrbitals))
    saveMandala()
}

haloRadiusRange.oninput = () => {
    haloRadius = haloRadiusRange.value;
    MANDALA.haloRadius = haloRadius
    localStorage.setItem(LOCAL_STORAGE_KEY_HALO_RADIUS, JSON.stringify(haloRadius))
    saveMandala()
}

/* ----- RENDER MANDALA ----- */
const mandalaContainer = document.querySelector('[data-mandala]')

const renderMandala = () => {
    mandalaContainer.innerHTML = '';
    const origoRings = MANDALA.origo;
    const haloRings = MANDALA.halo;
    origoRings.forEach(ring => {
        createOrigoRings(ring.id, ring.radius, ring.color, ring.width)
    });
    
    for (let index = 0; index < haloOrbitals; index++) {
        const rotation = 360 / haloOrbitals
        createOrbs(index, haloRings, rotation)
    }
    
} 

const createOrigoRings = (id, radius, color, width) => {
    const ring = document.createElement('div')
    ring.setAttribute('data-origo-id', id)
    ring.style.height = radius + 'px';
    ring.style.width = radius + 'px';
    ring.style.border = `${width}px solid ${color}`;
    mandalaContainer.append(ring)
}

const createOrbs = (index, rings, rotation) => {
    const orb = document.createElement('div')
    orb.setAttribute('data-orb-id', index)
    orb.classList.add(`halo-orb-${index}`)
    orb.style.position = 'absolute';
    orb.style.top = '50%';
    orb.style.left = '50%';
    orb.style.transform = `translate(-50%, -50%) rotate(${index * rotation + rotation/2}deg) translateY(${haloRadius}px)`;
    
    rings.forEach((ring, index) => {
        const orbRing = createHaloRings(ring.id, ring.radius, ring.color, ring.width, haloRadius, haloOrbitals, index)
        orb.append(orbRing)
    });
    
    mandalaContainer.append(orb)
}

const createHaloRings = (id, radius, color, width, haloRadius, haloOrbitals, index) => {
    const ring = document.createElement('div')
    ring.setAttribute('data-orb-ring-id', id);
    ring.classList.add(`halo-orb-ring-${id}`);
    ring.classList.add('halo-orb-ring');
    ring.style.position = 'absolute';
    ring.style.top = '50%';
    ring.style.left = '50%';
    ring.style.transform = `translate(-50%, -50%)`;
    ring.style.height = radius + 'px';
    ring.style.width = radius + 'px';
    ring.style.border = `${width}px solid ${color}`;

    return ring
}

/* ----- ZOOM ----- */
const LOCAL_STORAGE_ZOOM = 'mm004.zoomKey';

const zoomRange = document.querySelector('#zoom-range')
const zoomRangeSpan = document.querySelector('.zoom-range-span')
const zoomView = document.querySelector('.zoom-lens')

let zoom = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ZOOM));
zoomView.style.transform = `scale(${zoom})`

zoomRange.value = zoom;
zoomRangeSpan.innerText = `(${parseInt(zoom * 100)}) %`
zoomRange.oninput = () => {
    zoomRangeSpan.innerText = `(${parseInt(zoomRange.value * 100)}) %`
    zoomView.style.transform = `scale(${zoomRange.value})`
    localStorage.setItem(LOCAL_STORAGE_ZOOM, JSON.stringify(zoomRange.value))
    renderMandala()
}

renderMandala()

/* ----- RENDER LIST ----- */
const mandalaList = document.querySelector('[data-menu-left-list]')

const renderList = () => {
    const origoRings = MANDALA.origo
    origoRings.forEach(ring => {
        const listItem = createListItem(ring)
        listItem.li.append(listItem.span)
        mandalaList.append(listItem.li)
    })
    // Set all
    const changeAllColor = document.createElement('div')
    changeAllColor.classList.add('change-all-color')
    const changeAllColorButton = document.createElement('button')
    changeAllColorButton.innerText = 'Set All';
    changeAllColorButton.onclick = () => {
        origoRings.forEach(ring => {
            const colors = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
            ring.color = `hsla(${colors[0]} ,${colors[1]}%,${colors[2]}%,${colors[3]}%)`;
            const spans = document.querySelectorAll('.menu-left-list-item span')
            spans.forEach(span => {
                span.style.background = ring.color
            })
            saveMandala()
        })
    }
    changeAllColor.append(changeAllColorButton)
    mandalaList.append(changeAllColor)
}

let activeItem;

const createListItem = (ring) => {
    const span = document.createElement('span')
    span.style.height = ring.width + 'px';
    span.style.width = '2rem';
    span.style.background = ring.color;
    span.style.top = '0.5rem';
    span.style.right = '0.5rem';
    span.style.position = 'absolute';
    

    const li = document.createElement('li')
    li.classList.add('menu-left-list-item')
    li.style.position = 'relative';
    li.innerText = 'origo ' + ring.id
    li.onclick = (e) => {
        if(e.target.classList.contains('active')) return
        
        const lis = document.querySelectorAll('.menu-left-list-item')
        lis.forEach(item => {
            item.classList.remove('active')
            item.style.background = '';
            item.style.color = '';
        })
        activeItem = ring
        
        const activeRings = document.querySelectorAll('.mandala div')
        const activeRing = document.querySelector(`[data-origo-id="${ring.id}"]`)
        activeRings.forEach(ring => {
            ring.style.boxShadow = '';        
        })
        activeRing.style.boxShadow = '0 0 4px 4px rgba(0,0,0,.1) inset, 0 0 4px 4px rgba(0,0,0,.1)';
        
        const controls = setActiveItem(ring.id)
        li.classList.add('active')
        li.style.background = 'lightblue';
        li.style.color = 'white';
        
        const listItems = document.querySelectorAll('.menu-left ul > li > ul')
        listItems.forEach(item => {
            item.innerHTML = '';
        })

        const listItemLists = document.querySelectorAll('.menu-left ul > li > ul >li')
        listItemLists.forEach(item => {
            item.innerHTML = '';
        })

        const ul = document.createElement('ul')
        const li1 = document.createElement('li')
        const li2 = document.createElement('li')
        const li3 = document.createElement('li')
        li1.append(controls.width)
        li2.append(controls.radius)
        li3.append(controls.color)
        ul.append(li1)
        ul.append(li2)
        ul.append(li3)
        li.append(ul)
    }

    const returnObject = {
        li: li,
        span: span
    }
    return returnObject
}

const setActiveItem = (id) => {
    const activeItem = MANDALA.origo.find(ring => ring.id === id)

    const radiusRange = document.createElement('input')
    radiusRange.type = 'range';
    radiusRange.min = 0;
    radiusRange.max = 1000;
    radiusRange.value = activeItem.radius;
    radiusRange.oninput = () => {
        activeItem.radius = radiusRange.value;
        saveMandala()
    }
    
    const widthRange = document.createElement('input')
    widthRange.type = 'range';
    widthRange.min = 0;
    widthRange.max = 10;
    widthRange.value = activeItem.width;
    widthRange.oninput = () => {
        activeItem.width = widthRange.value;
        saveMandala()
    }

    const setColorButton = document.createElement('button')
    setColorButton.innerText = 'set color';
    setColorButton.style.background = activeItem.color;
    setColorButton.onclick = () => {
        const colors = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
        activeItem.color = `hsla(${colors[0]} ,${colors[1]}%,${colors[2]}%,${colors[3]}%)`;
        setColorButton.style.background = activeItem.color;
        // menu-left... span
        saveMandala()
    }

    const controls = {
        width: widthRange,
        radius: radiusRange,
        color: setColorButton,
    }
    return controls
}

const leftMenu = document.querySelector('[data-menu-left]')

leftMenu.onclick = (e) => {
    if(e.target.tagName === 'SECTION') {
        const lists = document.querySelectorAll('.menu-left ul > li')
        lists.forEach(list => { list.classList.remove('active') })
        
        const activeRings = document.querySelectorAll('.mandala div')
        activeRings.forEach(ring => { ring.style.boxShadow = ''; })
        
        const listItems = document.querySelectorAll('.menu-left ul > li > ul')
        listItems.forEach(item => {
            item.innerHTML = '';
            item.parentElement.style.background = '';
            item.parentElement.style.color = '';
            item.style.boxShadow = '';
        })
    }
}

const saveMandala = () => {
    renderMandala()
    localStorage.setItem(LOCAL_STORAGE_KEY_MANDALA, JSON.stringify(MANDALA))
}


/* ----- Hide lists ----- */
const origoTitle = document.querySelector('.origo-title')
const origoListElement = document.querySelector('.origo-list')
const haloTitle = document.querySelector('.halo-title')
const haloListElement = document.querySelector('.halo-list')
const haloRadiusElement = document.querySelector('.halo-radius')
const haloOrbitalsElement = document.querySelector('.halo-orbitals')

haloTitle.onclick = () => { toggleHalo() }
origoTitle.onclick = () => { toggleOrigo() }

const toggleOrigo = () => {
    origoTitle.classList.toggle('minimized')
    if(origoTitle.classList.contains('minimized')) {
        origoListElement.style.display = 'none';
    } else {
        origoListElement.style.display = 'block';
    }
}

const toggleHalo = () => {
    haloTitle.classList.toggle('minimized')
    if(haloTitle.classList.contains('minimized')) {
        haloListElement.style.display = 'none';
        haloRadiusElement.style.display = 'none';
        haloOrbitalsElement.style.display = 'none';
    } else {
        haloListElement.style.display = 'block';
        haloRadiusElement.style.display = 'block';
        haloOrbitalsElement.style.display = 'block';
    }
}

/* ----- HALO ----- */
const haloList = document.querySelector('[data-menu-left-list-halo]')

const renderHaloList = () => {
    const orbRings = MANDALA.halo
    orbRings.forEach(ring => {
        const listItem = createHaloListItem(ring)
        listItem.li.append(listItem.span)
        haloList.append(listItem.li)
    })
    const changeAllColor = document.createElement('div')
    changeAllColor.classList.add('change-all-color')
    const changeAllColorButton = document.createElement('button')
    changeAllColorButton.innerText = 'Set All';
    changeAllColorButton.onclick = () => {
        orbRings.forEach(ring => {
            const colors = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
            ring.color = `hsla(${colors[0]} ,${colors[1]}%,${colors[2]}%,${colors[3]}%)`;
            const spans = document.querySelectorAll('.menu-left-list-item-halo span')
            spans.forEach(span => {
                span.style.background = ring.color
            })
            saveMandala()
        })
    }
    changeAllColor.append(changeAllColorButton)
    haloList.append(changeAllColor)
}

const createHaloListItem = (ring) => {
    const span = document.createElement('span')
    span.style.height = ring.width + 'px';
    span.style.width = '2rem';
    span.style.background = ring.color;
    span.style.top = '0.5rem';
    span.style.right = '0.5rem';
    span.style.position = 'absolute';

    const li = document.createElement('li')
    li.classList.add('menu-left-list-item-halo')
    li.style.position = 'relative';
    li.innerText = 'halo ' + ring.id;
    li.onclick = (e) => {
        if(e.target.classList.contains('active')) return
        
        const lis = document.querySelectorAll('.menu-left-list-item-halo')
        lis.forEach(item => {
            item.classList.remove('active')
            item.style.background = '';
            item.style.color = '';
        })
        activeItem = ring

        const activeRings = document.querySelectorAll('.mandala div')
        const activeRing = document.querySelectorAll(`[data-orb-ring-id="${ring.id}"]`)
        activeRings.forEach(ring => {
            ring.style.boxShadow = '';        
        })
        activeRing.forEach(ring => {
            ring.style.boxShadow = '0 0 4px 4px rgba(0,0,0,.1) inset, 0 0 4px 4px rgba(0,0,0,.1)';
        })

        const controls = setActiveHaloItem(ring.id)
        li.classList.add('active')
        li.style.background = 'lightblue';
        li.style.color = 'white';

        const listItems = document.querySelectorAll('.menu-left ul > li > ul')
        listItems.forEach(item => {
            item.innerHTML = '';
        })

        const listItemLists = document.querySelectorAll('.menu-left ul > li > ul >li')
        listItemLists.forEach(item => {
            item.innerHTML = '';
        })

        const ul = document.createElement('ul')
        const li1 = document.createElement('li')
        const li2 = document.createElement('li')
        const li3 = document.createElement('li')
        li1.append(controls.width)
        li2.append(controls.radius)
        li3.append(controls.color)
        ul.append(li1)
        ul.append(li2)
        ul.append(li3)
        li.append(ul)

    }

    const resObj = {
        span: span, 
        li: li
    }

    return resObj
}

const setActiveHaloItem = (id) => {
    const activeItem = MANDALA.halo.find(ring => ring.id === id)

    const radiusRange = document.createElement('input')
    radiusRange.type = 'range';
    radiusRange.min = 0;
    radiusRange.max = 900;
    radiusRange.value = activeItem.radius;
    radiusRange.oninput = () => {
        activeItem.radius = radiusRange.value;
        saveMandala()
    }
    
    const widthRange = document.createElement('input')
    widthRange.type = 'range';
    widthRange.min = 0;
    widthRange.max = 10;
    widthRange.value = activeItem.width;
    widthRange.oninput = () => {
        activeItem.width = widthRange.value;
        saveMandala()
    }

    const setColorButton = document.createElement('button')
    setColorButton.innerText = 'set color';
    setColorButton.style.background = activeItem.color;
    setColorButton.onclick = () => {
        const colors = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
        activeItem.color = `hsla(${colors[0]} ,${colors[1]}%,${colors[2]}%,${colors[3]}%)`;
        setColorButton.style.background = activeItem.color;;
        saveMandala()
    }

    const controls = {
        width: widthRange,
        radius: radiusRange,
        color: setColorButton,
    }
    return controls
}

renderHaloList()


/* ----- Animations ----- */

const viewPort = document.querySelector('.view')
const rotateButton = document.querySelector('[data-animation-rotate-button]')

rotateButton.onclick = () => { 
    startAnimation()
}

const startAnimation = () => {
    viewPort.classList.toggle('rotate360')
    rotateButton.style.color = 'red'
    rotateButton.innerText = 'Stop';
    rotateButton.onclick = resetAnimation
}

const resetAnimation = () => {
    viewPort.classList.toggle('rotate360')
    rotateButton.style.color = 'black'
    rotateButton.innerText = 'Rotate360';
    rotateButton.onclick = startAnimation
}

// const rotate360Animation = [
//     { transform: 'rotate(0)' },
//     { transform: `rotate(${rotation}deg)` }
// ];
// const rotate360AnimationMinus = [
//     { transform: 'rotate(0)' },
//     { transform: `rotate(${-2 * rotation}deg)` }
// ];

// const rotate360AnimationOptions = {
//     duration: 1000,
//     iterations: 1
// }

// const container = document.querySelector('.container')

// container.addEventListener('click', () => {
//     container.animate(rotate360Animation, rotate360AnimationOptions)
// })
// container.addEventListener('dblclick', () => {
//     container.animate(rotate360AnimationMinus, rotate360AnimationOptions)
// })

/* ----- Dark Mode ----- */
const darkModeButton = document.querySelector('[data-darkmode-button]');
const LOCAL_STORAGE_KEY_DARKMODE = 'mm004.darkmode';
let darkMode = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_DARKMODE)) || false;

darkModeButton.onclick = () => {
    document.documentElement.classList.toggle('darkmode')
    if(document.documentElement.classList.contains('darkmode')) { 
        darkMode = true; 
        darkModeButton.innerText = 'darkmode'
    }
    else { 
        darkMode = false; 
        darkModeButton.innerText = 'lightmode'
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_DARKMODE, JSON.stringify(darkMode))
}

if (darkMode === true) { darkModeButton.onclick(); }


/* ----- Set canvas bg ----- */
const LOCAL_STORAGE_KEY_MANDALA_BG = 'mm004.mandalaBackground'
const mandalaBackground = document.querySelector('.container')
const setMandalaBackgroundButton = document.querySelector('[data-set-mandala-background-button]')
mandalaBackground.style.background = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_MANDALA_BG)) || 'transparent';

setMandalaBackgroundButton.onclick = () => {
    const customColor = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    let backgroundString = `radial-gradient(transparent, hsla(${customColor[0]}, ${customColor[1]}%, ${customColor[2]}%, ${customColor[3]}%))`
    mandalaBackground.style.background = backgroundString
    localStorage.setItem(LOCAL_STORAGE_KEY_MANDALA_BG, JSON.stringify(backgroundString))
}



/* ----- Transform ----- */
const LOCAL_STORAGE_KEY_TRANSFORM = 'mm004.transform';
let TRANSFORM = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TRANSFORM)) || {
    id: {
        rotateX: '0',
        rotateY: '0',
        rotateZ: '0',
        translateX: '0',
        translateY: '0',
        translateZ: '0',
    },
    zoom: ''
}

const resetTransform = document.querySelector('[data-transform-reset-button]')
const rotateX = document.querySelector('#rotateX')
const rotateY = document.querySelector('#rotateY')
const rotateZ = document.querySelector('#rotateZ')
const translateX = document.querySelector('#translateX')
const translateY = document.querySelector('#translateY')
const translateZ = document.querySelector('#translateZ')

rotateX.oninput = () => { 
    TRANSFORM.id.rotateX = rotateX.value
    updateAndRenderRangesValues()
}
rotateY.oninput = () => { 
    TRANSFORM.id.rotateY = rotateY.value
    updateAndRenderRangesValues()
}
rotateZ.oninput = () => { 
    TRANSFORM.id.rotateZ = rotateZ.value
    updateAndRenderRangesValues()
}
translateX.oninput = () => { 
    TRANSFORM.id.translateX = translateX.value
    updateAndRenderRangesValues()
}
translateY.oninput = () => { 
    TRANSFORM.id.translateY = translateY.value
    updateAndRenderRangesValues()
}
translateZ.oninput = () => { 
    TRANSFORM.id.translateZ = translateZ.value
    updateAndRenderRangesValues()
}
resetTransform.onclick = () => {
    TRANSFORM.id.rotateX = 0
    TRANSFORM.id.rotateY = 0
    TRANSFORM.id.rotateZ = 0
    TRANSFORM.id.translateX = 0
    TRANSFORM.id.translateY = 0
    TRANSFORM.id.translateZ = 0
    updateAndRenderRangesValues()
}

const renderViewRangesValues = () => {
    rotateX.value = TRANSFORM.id.rotateX 
    rotateY.value = TRANSFORM.id.rotateY 
    rotateZ.value = TRANSFORM.id.rotateZ 
    translateX.value = TRANSFORM.id.translateX 
    translateY.value = TRANSFORM.id.translateY 
    translateZ.value = TRANSFORM.id.translateZ 
    // document.styleSheets[0].cssRules[0].style
    document.documentElement.style.setProperty('--rotateX', `${rotateX.value}deg`)
    document.documentElement.style.setProperty('--rotateY', `${rotateY.value}deg`)
    document.documentElement.style.setProperty('--rotateZ', `${rotateZ.value}deg`)
    document.documentElement.style.setProperty('--translateX', `${translateX.value}%`)
    document.documentElement.style.setProperty('--translateY', `${translateY.value}%`)
    document.documentElement.style.setProperty('--translateZ', `${translateZ.value}px`)
}

const updateAndRenderRangesValues = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TRANSFORM, JSON.stringify(TRANSFORM))
    renderViewRangesValues()
}

renderViewRangesValues()





/* ----- On LOAD ----- */
window.onload = () => { 
    menuButton.onclick();
    renderList()
}