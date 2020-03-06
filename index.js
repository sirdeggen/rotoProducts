/*******************************************************
 * Copyright (C) 2020 Darren Kellenschwiler
 * Contact: https://baemail.me/deggen@probat.us
 *
 * This file is part of RotoProducts.
 *
 * RotoProducts can not be copied and/or distributed without the express
 * permission of Brand Calibre Ltd.
 *******************************************************/

const rotoProduct = {}

rotoProduct.div = document.getElementById('rotoproduct')

const loader = document.createElement('div')
loader.id = 'loader'
const l = loader.style
l.height = '3rem'
l.width = 'calc(0% - 8rem)'
l.background = '#0096d6'
l.position = 'absolute'
l.color = 'rgb(240, 240, 240)'
l.padding = '2rem'
l['min-width'] = '8rem'
l['font-size'] = '2.5rem'
l['font-family'] = 'HPSimple, Arial'
loader.innerText = 'loading...'
rotoProduct.div.appendChild(loader)
rotoProduct.loader = document.getElementById('loader')

rotoProduct.loaded = (percent) => {
    if (0 > percent || percent >= 100) {
        percent = 100
        try {
            rotoProduct.loader.style.display = 'none'
            document.querySelector('.rotoClue').style.opacity = 1
            document.querySelector('.rotoButton').style.opacity = 1
        } catch (er) { console.log(er) }
    }
    rotoProduct.loader.style.width = `calc(${percent - 20}% - 8rem)`
}

rotoProduct.rotate = (x) => {
    try {
        Array.from(rotoProduct.div.children).splice(3).forEach( view => {
            const images = Array.from(view.children)
            let discrete = Math.floor((x / 100) * (images.length - 1))
            if (discrete > (images.length - 1)) {
                discrete = (images.length - 1)
            }
            if (discrete < 0) {
                discrete = 0
            }
            images.filter(i => i.style.display === 'block').forEach(i => i.style.display = 'none')
            images[discrete].style.display = 'block'
        })
    } catch (er) {
        console.log(er)
    }
}

rotoProduct.pan = (x, y) => {
    Array.from(rotoProduct.div.children).splice(3).forEach( view => {
        view.style.transform = `scale(2.5) translate(${x}, ${y})`
    })
}

rotoProduct.toggleZoom = (e) => {
    const x = 50 + ( e.offsetX / e.target.offsetWidth ) * -100
    const y = 50 + ( e.offsetY / e.target.offsetHeight ) * -100
    Array.from(rotoProduct.div.children).splice(3).forEach( view => {
        if (view.style.transform ===  '') {
            view.style.transform = `scale(2.5) translate(${x}%, ${y}%)`
        } else {
            view.style.transform = ''
        }
    })
}

rotoProduct.padNumber = number => {
    return number <= 99999 ? `0000${number}`.slice(-5) : number
}

const handleErrors = (response) => {
    if (!response.ok) {
        console.log('^ not a real Error, simply hitting the last image')
    }
    return response
}

const grabImages = async (base) => {
    let productImages = []
    try {
        let exists = true
        let x = 0
        do {
            exists = await fetch(base + rotoProduct.padNumber(x) + '.jpg')
                .then(handleErrors)
                .then(res => res.ok)
            rotoProduct.loading = rotoProduct.loading + rotoProduct.increment
            rotoProduct.loaded(rotoProduct.loading)
            const imageURL = base + rotoProduct.padNumber(x) + '.jpg'
            if(exists && typeof imageURL === 'string') {
                productImages.push(imageURL)
            }
            x++
        } while(exists)
    } catch (er) { console.log('^ not a real Error, simply hitting the last image') }
    return productImages
}

rotoProduct.preload = async (base, x) => {
    const images = await grabImages(base)
    try {
        const r = rotoProduct.div.style
        r.overflow = 'hidden'
        const div = document.createElement('div')
        const s = div.style
        if (x > 1) {
            s.display = 'none'
        } else {
            s.display = 'block'
        }
        div.classList.add('smooth', 'view-' + String(x))
        s.width = '100%'
        s.height = 'auto'
        s.top = 0
        s.left = 0
        return [ x, div, images ]
    } catch (e) {
        console.log('Something went horribly wrong:', e)
    }
    return [ x, false, images ]
}

rotoProduct.toggleView = () => {
    let views = Array.from(rotoProduct.div.children)
    views = views.filter(v => v.className.split(' ')[0] === 'smooth')
    rotoProduct.toggle = ((rotoProduct.toggle || 0) + 1) % views.length
    views.forEach(v => {
        if (v.className[12] !== String(rotoProduct.toggle + 1)) {
            v.style.display = 'none'
        } else {
            v.style.display = 'block'
        }
    })
}

rotoProduct.handleMouse = (e) => {
    const start = ( e.offsetX / e.target.offsetWidth ) * 100
    e.target.onmousemove = (e) => {
        let x = ( ( rotoProduct.x || 0 ) + (( e.offsetX / e.target.offsetWidth ) * 100) - start ) % 100
        if ( x < 0 ) { x = 100 + x }
        rotoProduct.rotate(x)
        rotoProduct.last = x
    }
}

rotoProduct.handleTouch = (e) => {
    let offsetX = e.touches[0].clientX - e.touches[0].target.offsetLeft
    const touchstart = ( offsetX / e.target.offsetWidth ) * 100
    e.target.ontouchmove = (e) => {
        offsetX = e.touches[0].clientX - e.touches[0].target.offsetLeft
        let x = ( ( rotoProduct.x || 0 ) + (( offsetX / e.changedTouches[0].target.offsetWidth ) * 100) - touchstart ) % 100
        if ( x < 0 ) { x = 100 + x }
        rotoProduct.rotate(x)
        rotoProduct.last = x
    }
}

rotoProduct.setNewStart = (e) => {
    rotoProduct.x = rotoProduct.last
    e.target.onmousemove = null
}

rotoProduct.loadOrderly = (set) => {
    let ordered = []
    let x = 1
    Object.values(set).forEach(v => {
        ordered.push(rotoProduct.preload(v, x))
        x++
    })
    Promise.all(ordered)
        .then(result => {
            result.forEach(r => {
                if (r[1]) {
                    rotoProduct.div.appendChild(r[1])
                    r[1].innerHTML = "<img style=\"display: block; width: 100%; height: auto;\" src=\"" + r[2].join("\" /><img style=\"display: none; width: 100%; height: auto;\" src=\"") + "\" />"
                }
            })
        })
}

rotoProduct.div.addEventListener('mousedown', rotoProduct.handleMouse)
rotoProduct.div.addEventListener('touchstart', rotoProduct.handleTouch)
rotoProduct.div.addEventListener('mouseup', rotoProduct.setNewStart)
rotoProduct.div.addEventListener('touchend', rotoProduct.setNewStart)
rotoProduct.div.addEventListener('dblclick', (e) => { rotoProduct.toggleZoom(e)})
document.querySelector('.rotoButton').addEventListener('click', rotoProduct.toggleView)
rotoProduct.loading = 0
rotoProduct.increment = Number(2 / Object.keys(rotoProduct.div.dataset).length)
rotoProduct.loadOrderly(rotoProduct.div.dataset)