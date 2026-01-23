"use client"
import React, { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { fetchUser, updateProfile } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { getFlightDataPartsFromPath } from 'next/dist/client/flight-data-helpers'

const Dashboard = () => {
    const { data: session, update } = useSession()
    const router = useRouter()
    const [form, setform] = useState({})
    const [open, setOpen] = useState(false)

    useEffect(() => {

        if (!session) {
            router.push('/login')
        }
        else {
            getData()
        }
    }, [])

    const getData = async () => {
        let u = null
        try {
            console.log(session)
            u = await fetchUser(session.user.name)
        } catch (e) {
            u = null
        }
        const s = session?.user || {}
        const merged = {
            name: s.OriginalName || u?.name || s.name || '',
            email: u?.email || s.email || '',
            username: u?.username || s.name || '',
            profilepic: u?.profilepic || s.image || '',
            coverpic: u?.coverpic || '',
            razorpayid: u?.razorpayid || '',
            razorpaysecret: u?.razorpaysecret || '',
        }
        setform(merged)
    }

    const handleChange = async (e) => {
        const { name, value } = e.target
        setform(prev => ({ ...prev, [name]: value }))
        // If editing the name, also update the session's OriginalName so header updates
        if (name === 'name' && session) {
            try {
                if (typeof update === 'function') {
                    await update({ ...session, user: { ...session.user, OriginalName: value } })
                } else {
                    // fallback: mutate session object (best-effort)
                    session.user = { ...session.user, OriginalName: value }
                }
            } catch (err) {
                console.error('Failed to update session OriginalName', err)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const fd = new FormData(e.target)
        await updateProfile(fd, session.user.name)
        const newName = fd.get('name') || ''
        const newUsername = fd.get('username') || ''
        setform(prev => ({ ...prev, name: newName || prev.name, username: newUsername || prev.username }))
        try {
            if (typeof update === 'function' && session) {
                await update({ ...session, user: { ...session.user, name: newUsername || session.user.name, OriginalName: newName || session.user.OriginalName } })
            }
        } catch (err) {
            console.error('Failed to update session after profile save', err)
        }
        toast('Profile Updated', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className='container mx-auto py-5 px-6 '>
                <h1 className='text-center my-5 text-3xl font-bold'>Welcome to your Dashboard</h1>

                {/* Collapsible profile bar */}
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between rounded p-3 shadow-sm" style={{ background: 'linear-gradient(90deg,#155DFC 0%,#814CFE 100%)', color: '#ffffff', minHeight: '72px' }}>
                        <div className="flex items-center gap-4">
                            <img src={form.profilepic || session?.user?.image || '/favicon.ico'} alt="avatar" className="w-14 h-14 rounded-full object-cover" />
                            <div>
                                <div className="text-lg font-semibold">{form.name ?? session?.user?.OriginalName ?? session?.user?.name ?? 'Your Name'}</div>
                                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>@{form.username ?? session?.user?.OriginalName ?? session?.user?.name ?? 'username'}</div>
                            </div>
                        </div>
                        <div>
                            <button type="button" onClick={() => setOpen(!open)} style={{ backgroundColor: '#00091D' }} className="px-4 py-2 text-white rounded text-sm">{open ? 'Close' : 'Edit Profile'}</button>
                        </div>
                    </div>

                    {/* Expanded area: show the existing form inside a gray box when open */}
                    <div className={`${open ? 'block' : 'hidden'} mt-3 p-4 rounded`} style={{ backgroundColor: 'rgba(129,76,254,0.06)', border: '1px solid rgba(21,93,252,0.12)' }}>{
                        /* keep the existing form markup unchanged inside here */
                    }
                        <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>

                            <div className='my-2'>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input value={form.name ?? (session?.user?.OriginalName ?? "")} onChange={handleChange} type="text" name='name' id="name" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            {/* input for email */}
                            <div className="my-2">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input value={form.email ? form.email : ""} disabled type="email" name='email' id="email" className=" block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 "/>
                            </div>
                            {/* input forusername */}
                            <div className='my-2'>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                <input value={form.username ? form.username : ""} onChange={handleChange} type="text" name='username' id="username" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            {/* input for profile picture of input type text */}
                            <div className="my-2">
                                <label htmlFor="profilepic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Picture</label>
                                <input value={form.profilepic ? form.profilepic : ""} onChange={handleChange} type="text" name='profilepic' id="profilepic" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>

                            {/* input for cover pic  */}
                            <div className="my-2">
                                <label htmlFor="coverpic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cover Picture</label>
                                <input value={form.coverpic ? form.coverpic : ""} onChange={handleChange} type="text" name='coverpic' id="coverpic" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            {/* input razorpay id */}
                            <div className="my-2">
                                <label htmlFor="razorpayid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Razorpay Id</label>
                                <input value={form.razorpayid ? form.razorpayid : ""} onChange={handleChange} type="text" name='razorpayid' id="razorpayid" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            {/* input razorpay secret */}
                            <div className="my-2">
                                <label htmlFor="razorpaysecret" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Razorpay Secret</label>
                                <input value={form.razorpaysecret ? form.razorpaysecret : ""} onChange={handleChange} type="text" name='razorpaysecret' id="razorpaysecret" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>

                            {/* Submit Button  */}
                            <div className="my-6">
                                <button type="submit" className="block w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-blue-500 focus:ring-4 focus:outline-none   dark:focus:ring-blue-800 font-medium text-sm">Save</button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Dashboard