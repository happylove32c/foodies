  import React, { useState, useEffect } from 'react';
  import { createClient } from '@supabase/supabase-js';

  // Initialize Supabase client
  const supabaseUrl = 'https://sdbtmvllsjmqvqqbrrgr.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYnRtdmxsc2ptcXZxcWJycmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMjg4NjgsImV4cCI6MjA1MDkwNDg2OH0.4mH-9lkCEbu27yl5VbLFeOe3ei5nBLRnbfPlgyF-dc4';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch orders from the Supabase database
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*') // Ensure the order details column is included
            .order('created_at', { ascending: false });

          if (error) throw error;

          setOrders(data);
        } catch (error) {
          console.error('Error fetching orders:', error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();

      const interval = setInterval(() => {
        fetchOrders();
      }, 1000);
    
      // Cleanup interval on component unmount
      return () => clearInterval(interval);

    }, []);

    const foodNames = orders.map(order => order.name);

    // Handle order completion (delete)
    const handleCompleteOrder = async (orderId) => {
      try {
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', orderId);

        if (error) throw error;

        // Remove the order from the local state
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      } catch (error) {
        console.error('Error completing order:', error.message);
      }
    };

    return (
      <div className="bg-yellow min-h-screen pt-28">
        <div className="header w-full flex items-center justify-center">
          <h1 className="text-red-dark text-5xl">Welcome</h1>
        </div>

        <div className="min-h-screen">
          <div className="header w-full flex items-center justify-center">
            <h1 className="text-2xl text-red-dark">Your Orders</h1>
          </div>
  
          <div className="p-8 w-full flex items-center justify-center ">
            {loading ? (
              <p className='text-2xl text-white'>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className='text-2xl text-white'>No orders available.</p>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-white shadow-md rounded-lg flex flex-col space-y-4"
                  >
                    <div>
                      <h2 className="text-lg font-bold">Order ID: {order.id}</h2>
                      <p><strong>Name:</strong> {order.name}</p>
                      <p><strong>Contact:</strong> {order.contact}</p>
                      <p><strong>Total Price:</strong> ${(order.total_price / 100).toFixed(2)}</p>
                      <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
                      <p><strong>Order Details:</strong></p>
                      <ul>
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))
          ) : (
            <li>No details provided</li>
          )}
        </ul>
                    </div>
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Mark as Completed
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default Dashboard;
