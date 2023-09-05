const root = document.getElementById('root')
const compra = document.getElementById('carrito')
const templateCard = document.getElementById('template-card').content
const templateCarrrito = document.getElementById('template-carrito').content
const templateFooter = document.getElementById('template-footer').content
const foot = document.getElementById('foot')
const vaciar = document.getElementById('boton-vaciar')
const fragment = document.createDocumentFragment()
carro = {}

document.addEventListener('DOMContentLoaded', () => {
    Data()
})

root.addEventListener('click',e => {
    if(e.target.classList.contains('btn')){
        carrito(e.target.parentElement)
    }
    e.stopPropagation()
})

compra.addEventListener('click',e => {
        accion(e)

    
})


const Data = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        //console.log(data)
        data.forEach(element => {
            show_card(element)
        });
        
    } catch (error) {
        console.log(error)
    }
}

const show_card = (e =>{
    templateCard.querySelector('img').setAttribute('src',e.thumbnailUrl)
    templateCard.querySelector('.card-title span').textContent = e.precio
    templateCard.querySelector('.card-text').textContent = e.title
    templateCard.querySelector('.btn').dataset.id = e.id

    const clone = templateCard.cloneNode(true)
    fragment.appendChild(clone)
    root.appendChild(fragment)


})




const carrito = datos => {
    const producto = {
        title: datos.querySelector('.card-text').textContent,
        precio: datos.querySelector('.card-title span').textContent,
        id: datos.querySelector('.btn').dataset.id,
        cantidad: 1
    }
    if(carro.hasOwnProperty(producto.id)){
        producto.cantidad = carro[producto.id].cantidad + 1
    }

    carro[producto.id] = {...producto}
    //console.log(carro)
    pintar_carrito()
   
}


const pintar_carrito = () => {
    compra.innerHTML = ''
    Object.values(carro).forEach(e => {
        //console.log(e)
        templateCarrrito.querySelectorAll('td')[0].textContent = e.title
        templateCarrrito.querySelectorAll('td')[1].textContent = e.cantidad
        templateCarrrito.querySelectorAll('td')[3].textContent = e.precio * e.cantidad
        templateCarrrito.querySelector('.btn-dark').dataset.id = e.id
        templateCarrrito.querySelector('.btn-light').dataset.id = e.id


        const clone = templateCarrrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    compra.appendChild(fragment)
    pintar_footer()
}

const pintar_footer = () => {
    foot.innerHTML = ''
    if(Object.keys(carro).length === 0){
        foot.innerHTML = `
        <tr><td colspan="4" > Carrito Vacio - Empieza a comprar!! </td> </tr>`
        return
    }
    const ncantidad = Object.values(carro).reduce((acc, {cantidad}) => acc + cantidad,0)
    const nprecio = Object.values(carro).reduce((acc, {precio,cantidad}) => acc + cantidad * precio,0)

    templateFooter.querySelectorAll('td')[1].textContent = ncantidad
    templateFooter.querySelector('span').textContent = nprecio


    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    foot.appendChild(fragment)

    const vaciar = document.getElementById('boton-vaciar')
    vaciar.addEventListener('click', () =>{
        carro = {}
        pintar_carrito()
    })
}

const accion = e => {
    if(e.target.classList.contains('btn-dark')){
        const producto = carro[e.target.dataset.id]
        producto.cantidad++
        carro[e.target.dataset.id] = {...producto}
        pintar_carrito()
    }
    if(e.target.classList.contains('btn-light')){
        const producto = carro[e.target.dataset.id]
        producto.cantidad--
        carro[e.target.dataset.id] = {...producto}
        if(producto.cantidad === 0){
            delete carro[e.target.dataset.id]
        }
        pintar_carrito()
    }
    e.stopPropagation()
}







