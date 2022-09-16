class Producto {
    constructor(id, nombre, precio, foto) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.foto = foto;
    }
}

class ElementoCarrito {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
}

/**
 * Definiciones de constantes
 */
const estandarDolaresAmericanos = Intl.NumberFormat('en-US');

//Arrays donde guardaremos catálogo de productos y elementos en carrito
const productos = [];
const elementosCarrito = [];

const contenedorProductos = document.getElementById('contenedor-productos');

const contenedorCarritoCompras = document.querySelector("#items")

const contenedorFooterCarrito = document.querySelector("#footer");

/**
 * Ejecución de funciones
 */

cargarProductos();
cargarCarrito();
dibujarCarrito();
dibujarCatalogoProductos();

/**
 * Definiciones de funciones
 */

function cargarProductos() {
    productos.push(new Producto(1, 'Pantalon', 2800, './img'));
    productos.push(new Producto(2, 'Remera', 1500, './img'));
    productos.push(new Producto(3, 'Camisa', 2500, './img'));
    productos.push(new Producto(4, 'buzo', 3600, './img'));
    productos.push(new Producto(5, 'campera', 8500, './img'));
    productos.push(new Producto(6, 'zapatillas', 20000, './img'));
    productos.push(new Producto(7, 'gorra', 900, './img'));
    productos.push(new Producto(8, 'short', 1100, './img'));
}

function cargarCarrito() {
    /*let elementoCarrito = new ElementoCarrito(
        new Producto(1, 'Muffin', 1.99, './img/muffin.jpg'),
        1
    );

    elementosCarrito.push(elementoCarrito);*/
}

function dibujarCarrito() {
    contenedorCarritoCompras.innerHTML = "";

    elementosCarrito.forEach(
        (elemento) => {
            let renglonesCarrito= document.createElement("tr");
            
            renglonesCarrito.innerHTML = `
                <td>${elemento.producto.id}</td>
                <td>${elemento.producto.nombre}</td>
                <td><input id="cantidad-producto-${elemento.producto.id}" type="number" value="${elemento.cantidad}" min="1" max="1000" step="1" style="width: 50px;"/></td>
                <td>$ ${elemento.producto.precio}</td>
                <td>$ ${estandarDolaresAmericanos.format(elemento.producto.precio*elemento.cantidad)}</td>
                <td><botton id="eliminar-producto-${elemento.producto.id}" type ="button" class="btn btn-danger"><i class="bi bi-trash-fill"</button></td>
                
            `;

            contenedorCarritoCompras.append(renglonesCarrito);

            //Agregar evento a input de renglon en carrito
            let inputCantidadProducto = document.getElementById(`cantidad-producto-${elemento.producto.id}`);
            inputCantidadProducto.addEventListener('change', (ev) => {
                let nuevaCantidad = ev.target.value;
                elemento.cantidad = nuevaCantidad;

                dibujarCarrito();
            });
            
            //agregar evento a eliminar producto
            let botonEliminarProducto = document.getElementById(`eliminar-producto-${elemento.producto.id}`);
            botonEliminarProducto.addEventListener('click',() => {
                //alert("hicimos click" + elementosCarrito.indexOf(elemento));

                let indiceEliminar = elementosCarrito.indexOf(elemento);
                elementosCarrito.splice(indiceEliminar,1);

                dibujarCarrito();  
            });
        }
    );
        
    const valorInicial = 0;
    const totalComprar = elementosCarrito.reduce(
        (previusValue, currentValue) => previusValue + currentValue.producto.precio*currentValue.cantidad,valorInicial
    );

    if(elementosCarrito.length == 0) {
        contenedorFooterCarrito.innerHTML = `<th scope="row" colspan="6">Carrito vacio - comience a comprar!</th>`;
    } else {
        contenedorFooterCarrito.innerHTML = `<th scope="row" colspan="6">Total de la compra: ${totalComprar}</th>`;
    }

}

function removerProductoCarrito(elementoAEliminar) {
    const elementosAMantener = elementosCarrito.filter((elemento) => elementoAEliminar.producto.id != elemento.producto.id);
    elementosCarrito.length = 0;

    elementosAMantener.forEach((elemento) => elementosCarrito.push(elemento));
}

function crearCard(producto) {
    //Botón
    let botonAgregar = document.createElement("button");
    botonAgregar.className = "btn btn-warning";
    botonAgregar.innerText = "Agregar";

    //Card body
    let cuerpoCarta = document.createElement("div");
    cuerpoCarta.className = "card-body";
    cuerpoCarta.innerHTML = `
        <h5>${producto.nombre}</h5>
        <p>$ ${producto.precio} ARS</p>
    `;
    cuerpoCarta.append(botonAgregar);

    //Imagen
    let imagen = document.createElement("img");
    imagen.src = producto.foto;
    imagen.className = "card-img-top";
    imagen.alt = producto.nombre;

    //Card
    let carta = document.createElement("div");
    carta.className = "card m-2 p-2";
    carta.style = "width: 18rem";
    carta.append(imagen);
    carta.append(cuerpoCarta);

    //Contenedor Card
    //let contenedorCarta = document.createElement("div");
    //contenedorCarta.className = "col-xs-6 col-sm-3 col-md-2";
    //contenedorCarta.append(carta);

    //Agregar algunos eventos
    botonAgregar.onclick = () => {
        let elementoExistente = elementosCarrito.find((elem) => elem.producto.id == producto.id);


        if(elementoExistente) {
            elementoExistente.cantidad+=1;
        } else {
            let elementoCarrito = new ElementoCarrito(producto, 1);
            elementosCarrito.push(elementoCarrito);
        } 
        

        

        dibujarCarrito();

      swal({
        title: 'Articulo agregado al Carrito',
        text: `${producto.nombre} $ ${producto.precio}`,
        icon: 'success',
        buttons: {
            cerrar: {
                text: "cerrar",
                value: false
            },
            carrito: {
                text: "ir al carrito",
                value: true
            }
        }
      }).then((decision) => {
        if(decision) {
            const myModal = new bootstrap.Modal (document.getElementById('exampleModal'), {keyboard: true});
            const modalToggle = document.getElementById('toggleMyMosal');
            myModal.show(modalToggle);
        }else {
            swal("No quiero ir al carrito");
        }
      });
       
    } 
    
    return carta;

}

function dibujarCatalogoProductos() {
    contenedorProductos.innerHTML = "";

    productos.forEach(
        (producto) => {
            let contenedorCarta = crearCard(producto);
            contenedorProductos.append(contenedorCarta);
        }
    );

}

