import React from 'react'
import { assets } from '../../assets/assets'
import {
  LayoutDashboardIcon,
  PlusSquareIcon,
  ListIcon,
  ListCollapseIcon
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const AdminSidebar = () => {
  const user = {
    firstName: 'Admin',
    lastName: 'User',
    imageUrl: assets.profile,
  }

  const adminNavlinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
    { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
    { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },
    { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon },
  ]

  return (
    <div className='h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 md:w-60 w-full border-r border-gray-800 bg-black text-sm text-white'>
      <img
        className='h-10 w-10 md:h-16 md:w-16 rounded-full mx-auto border border-gray-700'
        src={user.imageUrl}
        alt="sidebar"
      />
      <p className='mt-2 text-base max-md:hidden font-medium'>
        {user.firstName} {user.lastName}
      </p>

      <div className='w-full flex flex-col mt-6 space-y-2 px-2'>
        {adminNavlinks.map((link, index) => {
          const Icon = link.icon
          return (
            <NavLink
              key={index}
              to={link.path}
              end
              className={({ isActive }) =>
                `relative flex items-center max-md:justify-center gap-3 w-full py-2.5 px-4 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" />
                  <p className="max-md:hidden">{link.name}</p>
                  <span
                    className={`w-1.5 h-10 rounded-l absolute right-0 top-1/2 -translate-y-1/2 ${
                      isActive ? 'bg-primary' : ''
                    }`}
                  />
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default AdminSidebar
