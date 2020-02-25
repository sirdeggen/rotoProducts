const rotoProduct = {}

    rotoProduct.div = document.getElementById('rotoproducts')

    rotoProduct.rotate = (x) => {
        try {
            const images = Array.from(rotoProduct.div.children[0].children)
            let discrete = Math.floor((x / 100) * (images.length - 1))
            if (discrete > (images.length - 1)) {
                discrete = (images.length - 1)
            }
            if (discrete < 0) {
                discrete = 0
            }
            images.filter(i => i.style.display === 'block').forEach(i => i.style.display = 'none')
            images[discrete].style.display = 'block'
        } catch (er) {
            console.log(er)
        }
    }

    rotoProduct.padNumber = number => {
        return number <= 99999 ? `0000${number}`.slice(-5) : number
    }

    const grabImages = async (base) => {
        let productImages = []
        try {
           let exists = true
           let x = 0
           do {
               exists = await fetch(base + rotoProduct.padNumber(x) + '.jpg')
                   .then(res => res.ok)
                   .catch(er => console.log('lastimage'))
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
            console.log('views: ', rotoProduct.views)
            const s = div.style
            if (rotoProduct.views > 1) {
                s.display = 'none'
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
        const button = document.createElement('button')
        rotoProduct.div.appendChild(button)
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

    rotoProduct.setNewStart = (e) => {
        rotoProduct.div
        e.target.onmousemove = null
    }
console.log('rotoProduct Loaded Successfully')

