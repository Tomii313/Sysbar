import React, { useState, useEffect } from "react";
import "./Catalogo.css";
import {useNavigate} from "react-router-dom";



const ProductCard = ({ image, title, price, onAddToCart }) => {
  return (
    <div className="product-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{price}</p>
      <button onClick={onAddToCart}>Agregar al carrito</button>
    </div>
  );
};

const Catalogo = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartMessage, setCartMessage] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado para abrir/cerrar carrito
  const [totalPrice, setTotalPrice] = useState(0); // Estado para el total

  const navigate = useNavigate();

  const shampooProducts = [
    { id: 1, title: "Shampoo Fidelité Mythical Argán Kit Shampoo + Acondicionador x900ml", price: "$20.491,80", image: "https://http2.mlstatic.com/D_NQ_NP_853519-MLU75604185834_042024-O.webp/150" },
    { id: 2, title: "Shampoo Clear Men Limpieza Diaria 400ML", price: "$6.500", image: "https://http2.mlstatic.com/D_NQ_NP_816973-MLA74651642398_022024-O.webp/150" },
    { id: 5, title: "Acondicionador Absolut Repair Serie Expert 750mL", price: "$77.999", image: "https://http2.mlstatic.com/D_NQ_NP_864188-MLU77050062928_062024-O.webp/150" },
    { id: 6, title: "Acondicionador Fructis Hair Food Manteca De Cacao 300ml", price: "$4.097", image: "https://http2.mlstatic.com/D_NQ_NP_821239-MLU75692580224_042024-O.webp/150" },
  ];

  const gelProducts = [
    { id: 3, title: "Gel para el pelo Algabo 150gr", price: "$1.800", image: "https://http2.mlstatic.com/D_NQ_NP_995397-MLU74255295213_012024-O.webp" },
    { id: 7, title: "Polvo texturizador PRIMONT 5gr", price: "$5.900", image: "https://http2.mlstatic.com/D_NQ_NP_749716-MLU75020993285_032024-O.webp" },
  ];

  const waxProducts = [
    { id: 4, title: "Cera Old Wax Fijacion Extra Fuerte Sir Fausto X 100ml Barber", price: "$5.575,18", image: "https://http2.mlstatic.com/D_NQ_NP_859953-MLU72579701584_112023-O.webp" },
  ];

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
    setCartMessage(`${product.title} agregado al carrito.`);
    setTimeout(() => setCartMessage(""), 3000); // Mensaje desaparece después de 3 segundos
  };

  // Calcular el total del carrito cada vez que cambian los items del carrito
  useEffect(() => {
    const newTotalPrice = cartItems.reduce((acc, item) => {
      const numericPrice = parseFloat(item.price.replace(/[$.]/g, "").replace(".", "").replace(",", ".")); // Convierte a número y reemplaza el valor de la coma por el punto.
      return acc + numericPrice;
    }, 0);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);
  
//Redirección al hacer click en el botón CHECKOUT.

const handleCheckout = () => {
  navigate("/compra-final", {state: {cartItems, totalPrice}});
}


  return (
    <div className="fondo-catalogo">
      {/* Icono del carrito con contador */}
      <div className="cart-icon" onClick={() => setIsCartOpen(!isCartOpen)}>
        <img src="/carrito.png" alt="Carrito" />
        <span>{cartItems.length}</span>
      </div>

      {/* Menú del carrito */}
      {isCartOpen && (
        <div className="cart-menu">
          <h3>Carrito de compras</h3>
          <button onClick={() => setIsCartOpen(false)} className="close-cart-button">
      Cerrar
    </button> {/* Botón para cerrar el carrito */}
          {cartItems.length === 0 ? (
            <p>Tu carrito está vacío</p>
          ) : (
            <div>
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <p>{item.title}</p>
                  <p>Precio: ${item.price}</p>
                </div>
              ))}
              <h4>Total: ${totalPrice.toFixed(2)}</h4>
              <button className="checkout-button" onClick={handleCheckout}>Proceder con la compra
                
              </button>

            </div>
          )}
        </div>
      )}

<div className="catalogo">
        {cartMessage && (
          <div className="cartMessage">
            {cartMessage}
          </div>
        )}

        {/* Sección de Shampoos */}
        <div className="catalog-section">
          <h2>Shampoos y Acondicionadores</h2>
          <div className="product-list">
            {shampooProducts.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        </div>

        {/* Sección de Geles */}
        <div className="catalog-section">
          <h2>Productos para el peinado</h2>
          <div className="product-list">
            {gelProducts.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        </div>

        {/* Sección de Ceras */}
        <div className="catalog-section">
          <h2>Ceras y Pomadas</h2>
          <div className="product-listt">
            {waxProducts.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogo;
