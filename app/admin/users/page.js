import React from "react";
import { getUsersAdmin, toggleUserRoleAdmin } from "@/actions/adminactions";
import { FiUsers, FiMail, FiPhone, FiMapPin, FiShield } from "react-icons/fi";

export default async function UsersPage() {
  const users = await getUsersAdmin();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#253D4E]">User Management</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">View registered customers and assign admin roles</p>
        </div>
        <div className="bg-[#DEF9EC] px-5 py-3 rounded-2xl border border-green-100 flex items-center gap-3 text-sm font-black text-[#253D4E] shadow-sm">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#3BB77E] shadow-sm">
            <FiUsers className="text-lg" /> 
          </div>
          {users.length} Total Users
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F4F6FA] border-b border-gray-100">
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest rounded-tl-3xl">User Profile</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Contact Details</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Saved Address</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Account Status</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right rounded-tr-3xl">Role Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400 font-black">No users registered yet.</td>
                </tr>
              ) : null}
              {users.map((user) => {
                const isVerified = !!user.emailVerified;
                const joinedDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
                  dateStyle: "medium"
                });
                
                return (
                  <tr key={user._id} className="hover:bg-[#F2FBF6] transition-colors group">
                    <td className="p-5 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#DEF9EC] border border-green-100 flex flex-col items-center justify-center text-[#3BB77E] font-black uppercase text-sm shrink-0 overflow-hidden relative">
                           {user.image ? (
                             <img src={user.image} referrerPolicy="no-referrer" alt="Avatar" className="w-full h-full object-cover" />
                           ) : (
                             (user.name?.charAt(0) || user.email?.charAt(0) || "U")
                           )}
                        </div>
                        <div>
                          <p className="font-black text-[#253D4E] text-[14px] flex items-center gap-1">
                             {user.name || "Quickzy User"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            Joined {joinedDate}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 align-top">
                      <p className="text-[13px] font-bold text-gray-800 break-all mb-1 flex items-center gap-1.5">
                        <FiMail className="text-gray-400" /> {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-[12px] text-gray-500 font-medium flex items-center gap-1.5 mt-1.5">
                          <FiPhone className="text-gray-400 shrink-0" /> {user.phone}
                        </p>
                      )}
                    </td>
                    <td className="p-5 align-top">
                      {user.address?.text ? (
                        <div className="flex items-start gap-1.5 bg-white border border-gray-100 p-2 rounded-xl">
                          <FiMapPin className="text-gray-400 mt-0.5 shrink-0 text-xs" />
                          <p className="text-[11px] text-gray-500 leading-tight font-bold max-w-[200px]">{user.address.text}</p>
                        </div>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest">No Address Saved</span>
                      )}
                    </td>
                    <td className="p-5 align-top">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border flex items-center gap-1 ${
                          user.role === "admin" ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-gray-50 border-gray-200 text-gray-600"
                        }`}>
                          <FiShield /> {user.role === "admin" ? "Admin" : "Customer"}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          isVerified ? "bg-[#DEF9EC] text-[#3BB77E]" : "bg-orange-50 text-orange-500"
                        }`}>
                          {isVerified ? "Email Verified" : "Unverified"}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 align-top text-right min-w-[150px]">
                      {/* Server Action Form replacing Client logic to toggle Admin Status */}
                      <form action={toggleUserRoleAdmin} className="inline-block">
                        <input type="hidden" name="id" value={user._id} />
                        <input type="hidden" name="currentRole" value={user.role} />
                        <button type="submit" className={`text-[10px] uppercase font-black tracking-widest px-4 py-2.5 rounded-xl transition-all shadow-sm border ${
                          user.role === "admin" 
                            ? "bg-white border-red-100 text-red-500 hover:bg-red-50" 
                            : "bg-[#253D4E] border-[#253D4E] text-white hover:bg-gray-800"
                        }`}>
                          {user.role === "admin" ? "Revoke Admin" : "Make Admin"}
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
