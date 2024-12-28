import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = 'https://sdbtmvllsjmqvqqbrrgr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYnRtdmxsc2ptcXZxcWJycmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMjg4NjgsImV4cCI6MjA1MDkwNDg2OH0.4mH-9lkCEbu27yl5VbLFeOe3ei5nBLRnbfPlgyF-dc4'
const supabase = createClient(supabaseUrl, supabaseKey)

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all items from Supabase
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data, error } = await supabase.from("menu_items").select("*");
        if (error) throw error;
        setFoods(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Add item to cart
  const addToCart = (food) => {
    setCart((prevCart) => [...prevCart, food]);
  };

  // Handle Checkout
  const handleCheckout = () => {
    navigate("/checkout", { state: { cart } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="bg-white mt-12 min-h-screen flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-8">
          {foods.map((food) => (
            <div
              key={food.id}
              className="p-4 m-6 bg-gray-100 aspect-square shadow-md rounded-lg text-center transform hover:scale-105 transition-transform"
            >
              <div className="flex flex-col items-center">
                {/* Image as Background */}
                <div
                  className="w-2/3 h-48 mb-4 bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url(${food.picture})` }}
                ></div>
                {/* Food Info */}
                <h2 className="text-lg font-bold">{food.name}</h2>
                <p className="text-sm text-gray-600">{food.content}</p>
                <p className="text-md font-semibold text-purple-600 mt-2">
                  ${food.price.toFixed(2)}
                </p>
                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(food)}
                  className="mt-4 px-4 py-2 bg-yellow hover:bg-yellow-dark text-white rounded-lg shadow-md"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Checkout Button */}
        {cart.length > 0 && (
          <button
            onClick={handleCheckout}
            className="mt-4 px-6 mb-5 py-3 bg-yellow hover:bg-yellow-dark text-white rounded-lg shadow-md"
          >
            Checkout ({cart.length} items)
          </button>
        )}
      </div>
    </div>
  );
};

export default Menu;
