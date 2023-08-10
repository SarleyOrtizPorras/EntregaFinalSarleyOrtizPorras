/*
- usar asincronia (fetch)
    - Opcion 1: Cargar un archivo .json local con mi producto
    - Opcion 2: Usar una API como la de Mercado Libre
*/

const getProducts = async () => {
    const respuesta = await fetch('./json/productos.json')
    return await respuesta.json()
}

const ListadoProductos = document.querySelector('#ListadoProductos')
ListadoProductos.classList.add('row', 'w-100')

const productos = await getProducts()

const renderProductos = () => {
    productos.forEach(producto => {
        const card = document.createElement('div')
        card.classList.add('card', 'col-4')

        card.innerHTML = `
        <div class='card-body'
        a href="${producto.id}" data-id="${producto.id}>
          <img src="$(producto.imgUrl)" class="w-25">
          <h3>Nombre: ${producto.nombre}</h3>
        </div>
        `
        ListadoProductos.appendChild(card)
    })
}

renderProductos()
console.log(productos) [
    {
        "id": 1,
        "nombre": "Zapatos1",
        "precio": 15.000,
        "categoria": "talla28",
        "imagen": "../img/zapatos.jpg",
        "ingUrl": "https://listado.mercadolibre.com.co/nike-air-force-one"
    },
    {
        "id": 2,
        "nombre": "Zapatos1",
        "precio": 15.000,
        "categoria": "talla30",
        "imagen": "../img/zapatos.jpg",
        "ingUrl": "https://listado.mercadolibre.com.co/nike-air-force-one"
    }
]

const luxon = require('luxon')