import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="px-6 pt-8 md:px-16 lg:px-36 w-full text-gray-300">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-10">
                <div className="md:max-w-90">
                    
                    <p className="mt-6 text-sm">
                        Just a E-Commerce website tempalate built with React. Just a Project.... Dont Pay Bro 
                        <br />
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <img src={assets.googlePlay} alt="google play" className="h-10 w-auto" />
                        <img src={assets.appStore} alt="app store" className="h-10 w-auto" />
                    </div>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-semibold mb-5 text-red-500">Broke Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="/">Home</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 text-red-500">Touch Grass!!</h2>
                        <div className="text-sm space-y-2">
                            <p>+1-234-567-890</p>
                            <p>dontcontact@email.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} © Broke. All Right Reserved.
            </p>
        </footer>
  )
}

export default Footer
