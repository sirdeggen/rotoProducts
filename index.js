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

rotoProduct.rotate = (x) => {
    try {
        Array.from(rotoProduct.div.children).splice(1).forEach( view => {
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
            const imageURL = base + rotoProduct.padNumber(x) + '.jpg'
            if(exists && typeof imageURL === 'string') {
                productImages.push(imageURL)
            }
            x++
        } while(exists)
    } catch (er) {
        console.log('no such image')
    }
    return productImages
}

rotoProduct.preload = async (base) => {
    const images = await grabImages(base)
    try {
        const r = rotoProduct.div.style
        r.overflow = 'hidden'
        const div = document.createElement('div')
        rotoProduct.views = (rotoProduct.views || 0) + 1
        const s = div.style
        if (rotoProduct.views > 1) {
            s.display = 'none'
        } else {
            s.display = 'block'
        }
        div.classList.add('view-' + String(rotoProduct.views))
        s.width = '100%'
        s.height = 'auto'
        s.top = 0
        s.left = 0
        rotoProduct.div.appendChild(div)
        div.innerHTML = "<img style=\"display: block; width: 100%; height: auto;\" src=\"" + images.join("\" /><img style=\"display: none; width: 100%; height: auto;\" src=\"") + "\" />"
    } catch (e) {
        console.log('Something went horribly wrong:', e)
    }
}

rotoProduct.toggleView = () => {
    let views = Array.from(rotoProduct.div.children)
    views = views.filter(v => v.className[0] === 'v')
    rotoProduct.toggle = ((rotoProduct.toggle || 0) + 1) % views.length
    views.forEach(v => {
        if (v.className[5] !== String(rotoProduct.toggle + 1)) {
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

rotoProduct.div.addEventListener('mousedown', rotoProduct.handleMouse)
rotoProduct.div.addEventListener('touchstart', rotoProduct.handleTouch)
rotoProduct.div.addEventListener('mouseup', rotoProduct.setNewStart)
rotoProduct.div.addEventListener('touchend', rotoProduct.setNewStart)
document.querySelector('.rotoButton').addEventListener('click', rotoProduct.toggleView)
Object.values(rotoProduct.div.dataset).forEach(v => {
    rotoProduct.preload(v)
})