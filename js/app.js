/*
objetivos de la Entrega Final:
- metodos de Arrays
- Usar el Dom
- Usar Eventos
- Usar storage
- mi base de datos
- librerias utilizadas: Toastify JS y sweetalert2
- categorias (filtrado)
- usar asincronia (fetch)
    - Opcion 1: Cargar un archivo .json local con mi producto
    - Opcion 2: Usar una API como la de Mercado Libre
*/

//molde para productos//
class Producto{
    constructor(id, nombre, precio, categoria, imagen = false){
        this.id = id,
        this.nombre = nombre;
        this.precio = precio;
        this.categoria =categoria;
        this.imagen = imagen;
    }
}

//simulador de datos. cargar productos de e-commerce.//
class BaseDeDatos{
    constructor() {
        this.productos = [];
        //cargo productos//
        this.agregarRegistro(1, "Zapatos1", 15000, "talla28", "zapatos.jpg");
        this.agregarRegistro(2, "Zapatos2", 15000, "talla30", "zapatos.jpg");
        this.agregarRegistro(3, "Zapatos3", 15000, "talla32", "zapatos.jpg");
        this.agregarRegistro(4, "Zapatos4", 15000, "talla36", "zapatos.jpg");
        this.agregarRegistro(5, "Zapatos5", 15000, "talla38", "zapatos.jpg");
        this.agregarRegistro(6, "Zapatos6", 15000, "talla40", "zapatos.jpg");
        this.agregarRegistro(7, "Zapatos7", 15000, "talla41", "zapatos.jpg");
        this.agregarRegistro(8, "Zapatos8", 15000, "talla42", "zapatos.jpg");
        this.agregarRegistro(9, "Zapatos9", 15000, "talla43", "zapatos.jpg");
    }

    agregarRegistro(id, nombre, precio, categoria, imagen) {
        const producto = new Producto(id, nombre, precio, categoria, imagen);
        this.productos.push(producto);
    }
    traerRegistros(){
        return this.productos;
    }
    registroPorId(id){
        return this.productos.find((producto) => producto.id === id);
    }
    registroPorNombre(palabra) {
        return this.productos.filter((producto) => producto.nombre.toLowerCase().include(palabra));
    }
    registroPorCategoria(categoria) {
        return this.productos.filter((producto) => producto.categoria == categoria);
    }
}

//objeto de la base de datos//
const bd = new BaseDeDatos();

//Elementos//
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const inputBuscar = document.querySelector("#inputBuscar")
const botonCarrito = document.querySelector("section h1");
const botonComprar = document.querySelector("#botonComprar");
const botonesCategorias = document.querySelectorAll(".btnCategoria");

//boton de busqueda//
botonesCategorias.forEach((boton) => {
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        const productosPorCategoria = bd.registroPorCategoria(boton.innerText);
        cargarProductos(productosPorCategoria);
    });
});
//categorias boton//
botonesCategorias.forEach((boton) => {
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        const productosPorCategoria = bd.registroPorCategoria(boton.innerText);
        cargarProductos(productosPorCategoria);
    });
});

//funcion//
cargarProductos(bd.traerRegistros());

//Registro de datos del html//
function cargarProductos(productos) {
    divProductos.innerHTML ="";
    for (const producto of productos) {
        divProductos.innerHTML += `
        <div class="producto">
            <h2>${producto.nombre}</h2>
            <p class="precio">${producto.precio}</p>
            <div class="imagen">
            <img src="img/${producto.imagen}" />
            </div>
            <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
        </div>
        `;
    }
    //botones de agregar al carrito//
    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    for (const boton of botonesAgregar) {
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const id = Number(boton.dataset.id);
            const producto = bd.registroPorId(id);
            carrito.agregar(producto);
        });
    }
}

//clase Carrito//
class Carrito{
    constructor(){
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
        this.Carrito = carritoStorage || [];
        this.total = 0;
        this.totalProductos = 0;
        this.listar();
    }
    agregar(producto) {
        const productoEnCarrito = this.estaEnCarrito(producto);
        if (productoEnCarrito) {
            //sumar cantidad//
            productoEnCarrito.cantidad++;
        } else {
            //agregar al carrito//
            this.Carrito.push({ ...producto, cantidad: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(this.Carrito));
        this.listar();
        //Toastify//
        Toastify({
            text: `${producto.nombre} fue agregado al carrito`,
            position: "center",
            className: "info",
            gravity: "bottom",
            style: {
              background: "linear-gradient(to right, blue, red)",
            }
          }).showToast();
    }
    estaEnCarrito ({ id }){
        return this.Carrito.find((producto) => producto.id === id);
    }

    quitar(id) {
        const indice = this.Carrito.findIndex((producto) => producto.id === id);
        //si la cantidad del producto es mayor a 1, le resto//
        if (this.Carrito[indice].cantidad > 1){
            this.Carrito[indice].cantidad--;
        }else{
            //sino, lo borro del carrito//
            this.Carrito.splice(indice, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(this.Carrito));
        this.listar();
    }

    listar() {
        this.total = 0;
        this.totalProductos = 0;
        divCarrito.innerHTML = "";
        for (const producto of this.Carrito) {
            divCarrito.innerHTML += `
                <div class="productoCarrito">
                    <h2>${producto.nombre}</h2>
                    <p>$${producto.precio}</p>
                    <p>cantidad: ${producto.cantidad}</p>
                    <a href="#" data-id="${producto.id}" class="btnQuitar">Quitar del carrito</a>
                </div>
            `;
            this.total += producto.precio * producto.cantidad;
            this.totalProductos += producto.cantidad;
        }
        if (this.totalProductos > 0){
            botonComprar.classList.remove("oculto");
        }else{
            botonComprar.classList.add("oculto");
        }

        
        //botones de quitar//
        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar) {
            boton.onclick = (event) => {
                event.preventDefault();
                this.quitar(Number(boton.dataset.id));
            }
        }
        //Actualizo variables carrito//
        spanCantidadProductos.innerHTML = this.totalProductos;
        spanTotalCarrito.innerHTML = this.total;
    }

    vaciar() {
        this.Carrito =[];
        localStorage.removeItem("Carrito");
        this.listar();
    }
}

//Evento Busqueda
inputBuscar.addEventListener("keyup", () => {
    const palabra = inputBuscar.value;
    const productosEncontrados = bd.registrosPorNombre(palabra.toLowerCase());
    cargarProductos(productosEncontrados);
});

//Toggle para ocultar/mostrar el carrito
botonCarrito.addEventListener("click", (event) => {
    document.querySelector("section").classList.toggle("ocultar");
});

//Toggle para comprar
botonComprar.addEventListener("click", () => {
    Swal.fire({
        title: "Tu pedido está en camino",
        text: '¡Su compra ha sido realizada con exito!',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
      carrito.vaciar();

});



// objeto carrito//
const carrito = new Carrito();