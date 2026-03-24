import React from "react";
import { getOrdersAdmin, updateOrderStatusAdmin } from "@/actions/adminactions";
import { FiShoppingBag, FiClock, FiMapPin, FiPhone, FiMail, FiTag } from "react-icons/fi";

const statusColors = {
  "Pending": "bg-yellow-100 text-yellow-700",
  "Processing": "bg-blue-100 text-blue-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  "Delivered": "bg-green-100 text-green-700",
  "Cancelled": "bg-red-100 text-red-700",
};

export default async function OrdersPage() {
  const orders = await getOrdersAdmin();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">Review live customer orders</p>
        </div>
        <div className="bg-green-100 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold text-gray-800">
          <FiShoppingBag /> {orders.length} Orders
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Order Info</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Items</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Payment</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No recent orders.</td></tr>
              )}
              {orders.map((order) => {
                const date = new Date(order.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium", timeStyle: "short"
                });
                return (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="p-4 align-top">
                      <div>
                        <p className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded w-fit text-xs border border-green-200">
                           #{String(order._id || "").slice(-6)}
                        </p>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><FiClock /> {date}</p>
                      </div>
                    </td>
                    <td className="p-4 align-top text-sm">
                      <p className="font-bold text-gray-800 flex items-center gap-1"><FiMail className="text-gray-400" /> {order.userEmail}</p>
                      <p className="text-gray-500 flex items-center gap-1 mt-1"><FiPhone className="text-gray-400" /> {order.phoneNumber}</p>
                      <div className="flex bg-gray-50 p-2 rounded border mt-2">
                         <FiMapPin className="text-gray-400 mt-0.5 shrink-0 mr-1" />
                         <p className="text-xs text-gray-600 truncate max-w-[200px]" title={order.address}>{order.address}</p>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto pr-2">
                        {order.items?.map((item, idx) => (
                           <div key={idx} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded border text-xs">
                             <span className="font-bold text-gray-800 truncate mr-2 w-[120px]">{item.quantity}x {item.name}</span>
                             <span className="text-gray-500 font-bold">₹{item.price * item.quantity}</span>
                           </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <p className="font-bold text-gray-800 text-lg">₹{order.totalAmount}</p>
                      {order.couponCode && (
                        <p className="flex items-center gap-1 text-green-700 text-xs mt-1">
                           <FiTag /> {order.couponCode} (-₹{order.discount})
                        </p>
                      )}
                      <p className={`text-xs font-bold px-2 py-1 rounded w-fit mt-2 ${order.paymentMethod === 'COD' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {order.paymentMethod}
                      </p>
                    </td>
                    <td className="p-4 align-top text-right">
                      <form action={updateOrderStatusAdmin} className="flex flex-col gap-2 items-end">
                        <input type="hidden" name="id" value={order._id} />
                        <select 
                           name="status"
                           defaultValue={order.status}
                           className={`text-xs font-bold px-3 py-2 rounded outline-none border cursor-pointer w-[140px] ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}
                        >
                           <option value="Pending">Pending</option>
                           <option value="Processing">Processing</option>
                           <option value="Out for Delivery">Out For Delivery</option>
                           <option value="Delivered">Delivered</option>
                           <option value="Cancelled">Cancelled</option>
                        </select>
                        <button type="submit" className="text-xs font-bold bg-white border px-3 py-1.5 rounded hover:bg-gray-50 w-[140px]">
                          Save Status
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
