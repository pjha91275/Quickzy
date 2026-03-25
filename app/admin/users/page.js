import React from "react";
import { getUsersAdmin, toggleUserRoleAdmin } from "@/actions/adminactions";
import { FiUsers, FiMail, FiPhone, FiMapPin, FiShield, FiCalendar } from "react-icons/fi";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function UsersPage() {
  const users = await getUsersAdmin();
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">View users and assign roles</p>
        </div>
        <div className="bg-green-100 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold text-green-800">
          <FiUsers /> {users.length} Total Users
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">User & Contact</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Delivery Address</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.length === 0 && (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500">No users found.</td></tr>
              )}
              {users.map((user) => {
                const isVerified = !!user.emailVerified;
                let joinedDate = "Unknown";
                if (user.createdAt) {
                  const d = new Date(user.createdAt);
                  if (!isNaN(d.getTime())) joinedDate = d.toLocaleDateString("en-IN");
                }
                const isCurrentUser = currentUserEmail === user.email;
                
                return (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="p-4 align-top">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold overflow-hidden shrink-0">
                           {user.image ? (
                             <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                           ) : (user.name?.charAt(0) || user.email?.charAt(0) || "U")}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{user.name || "Quickzy User"}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><FiMail /> {user.email}</p>
                          {user.phone && <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><FiPhone /> {user.phone}</p>}
                          <p className="text-xs text-gray-400 mt-2">Joined: {joinedDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top text-sm">
                      {user.address?.text ? (
                        <p className="text-gray-600 flex items-start gap-1"><FiMapPin className="mt-1 shrink-0" /> {user.address.text}</p>
                      ) : (
                        <span className="text-gray-400 italic">No Address</span>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xs px-2 py-1 rounded font-bold ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                          {user.role === "admin" ? "Admin" : "Customer"}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${isVerified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                          {isVerified ? "Verified" : "Unverified"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 align-top text-center">
                      {user.role === "admin" && !isCurrentUser ? (
                         <span className="text-xs text-gray-400 uppercase">Restricted</span>
                      ) : (
                        <form action={toggleUserRoleAdmin}>
                          <input type="hidden" name="id" value={user._id} />
                          <input type="hidden" name="currentRole" value={user.role} />
                          <button type="submit" className={`text-xs font-bold px-3 py-1.5 rounded border ${
                            user.role === "admin" ? "text-red-600 border-red-200 hover:bg-red-50" : "text-gray-800 border-gray-300 hover:bg-gray-100"
                          }`}>
                            {user.role === "admin" ? (isCurrentUser ? "Give Up Admin" : "Revoke Admin") : "Make Admin"}
                          </button>
                        </form>
                      )}
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
