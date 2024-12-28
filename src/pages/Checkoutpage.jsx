import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://sdbtmvllsjmqvqqbrrgr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYnRtdmxsc2ptcXZxcWJycmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMjg4NjgsImV4cCI6MjA1MDkwNDg2OH0.4mH-9lkCEbu27yl5VbLFeOe3ei5nBLRnbfPlgyF-dc4'
const supabase = createClient(supabaseUrl, supabaseKey)

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialCart = location.state?.cart || [];
  const [cart, setCart] = useState(initialCart);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", contact: "" });
  const [sendStatus, setSendStatus] = useState("idle"); // idle | sending | sent | error

  if (cart.length === 0) {
    return <p>Your cart is empty!</p>;
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const deleteItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  const handleOrderClick = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = async () => {
    setSendStatus("sending"); // Start sending

    const totalPriceInCents = Math.round(totalPrice * 100);
    const orderData = {
      name: formData.name,
      contact: formData.contact,
      items: cart,
      total_price: totalPriceInCents,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase.from("orders").insert([orderData]);

      if (error) throw error;

      console.log("Order successfully placed:", data);
      setSendStatus("sent"); // Mark as sent
      setTimeout(() => setSendStatus("idle"), 3000); // Reset after 3 seconds
      setIsModalOpen(false);
      setCart([]); // Clear cart after sending order

      // Redirect to the menu page
      navigate("/menu"); // Adjust the path to match your menu route
    } catch (error) {
      console.error("Error placing order:", error.message);
      setSendStatus("error"); // Mark as error
      setTimeout(() => setSendStatus("idle"), 3000); // Reset after 3 seconds
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cart.map((item, index) => (
          <div
            key={`${item.id}-${index}`} // Combines `id` and `index` to ensure uniqueness
            className="p-4 bg-white shadow-md rounded-lg flex items-center space-x-4"
          >
        <img
          src={item.picture}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-grow">
          <h2 className="font-bold">{item.name}</h2>
          <p>${item.price.toFixed(2)}</p>
        </div>
        <button
          onClick={() => deleteItem(item.id)}
          className="text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
    ))}
      </div>
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</h2>
        <button
          onClick={handleOrderClick}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Order
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Place Your Order</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Phone/Table Number</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter phone or table number"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className={`px-4 py-2 rounded-lg text-white ${
                  sendStatus === "sending"
                    ? "bg-yellow-500"
                    : sendStatus === "sent"
                    ? "bg-green-600"
                    : sendStatus === "error"
                    ? "bg-red-600"
                    : "bg-blue-600"
                }`}
                disabled={sendStatus === "sending"}
              >
                {sendStatus === "sending"
                  ? "Sending..."
                  : sendStatus === "sent"
                  ? "Sent"
                  : sendStatus === "error"
                  ? "Error"
                  : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
