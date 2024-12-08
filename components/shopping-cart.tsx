import React from "react";
import { MenuItem } from "@/types/menu-item";
import { ListGroup, Button } from "react-bootstrap";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface ShoppingCartProps {
  cartItems: MenuItem[];
  setCartItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  parcelMachineId: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cartItems,
  setCartItems,
  parcelMachineId,
}: ShoppingCartProps) => {
  const router = useRouter();

  const increaseQuantity = (index: number) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity++;
    setCartItems(newCartItems);
  };

  const decreaseQuantity = (index: number) => {
    const newCartItems = [...cartItems];
    if (newCartItems[index].quantity > 1) {
      newCartItems[index].quantity--;
      setCartItems(newCartItems);
    }
  };

  const removeFromCart = (index: number) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleOrder = () => {
    // Prepare the order details to be passed as query parameters
    const orderDetails = {
      cartItems,
      totalPrice: getTotalPrice(),
    };
  
    // Serialize the order details to JSON
    const orderDetailsJson = JSON.stringify(orderDetails);

    // match backend api
    const orderItems = cartItems.map((item: any) => ({
      menuItemId: item.id,
      quantity: item.quantity,
    }));
    const orderData = {
      parcelMachineId,
      customerId: 1,
      orderItems,
    };
    const order = JSON.stringify(orderData);

    // Use router.push to navigate to the order-summary page and pass the query
    router.push(`/order-summary?orderDetails=${orderDetailsJson}&order=${order}`);
  }; 
  

  return (
    <div className="mt-3">
      <h2>Koszyk</h2>
      {cartItems && cartItems.length === 0 ? (
        <p>Koszyk jest pusty</p>
      ) : (
        <>
          <ListGroup>
            {cartItems.map((item, index) => (
              <ListGroup.Item key={index}>
                <div>
                  <span>
                    {item.quantity} {item.name} (
                    {(item.price * item.quantity).toFixed(2)} zł)
                  </span>
                </div>
                <div className="mt-1">
                  <Button
                    onClick={() => decreaseQuantity(index)}
                    disabled={item.quantity <= 1}
                    variant="outline-danger"
                    className="mx-2"
                  >
                    <FaMinus />
                  </Button>
                  <Button
                    onClick={() => increaseQuantity(index)}
                    variant="outline-success"
                    className="mx-2"
                  >
                    <FaPlus />
                  </Button>
                  <Button
                    onClick={() => removeFromCart(index)}
                    variant="outline-dark"
                    className="mx-2"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="mt-3">
            <strong>Razem: {getTotalPrice().toFixed(2)} zł</strong>
          </div>
          <div className="text-center mt-3">
            <Button
              variant="dark"
              onClick={handleOrder}
              style={{ width: "90%" }}
            >
              Zamów
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
