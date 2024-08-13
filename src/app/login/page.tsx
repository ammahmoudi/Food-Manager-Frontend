// app/login/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Spacer, Checkbox, Link} from '@nextui-org/react';
import { login } from '../../services/api';
import {PhoneIcon, KeyIcon,EyeIcon,EyeSlashIcon} from '@heroicons/react/24/solid'


export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { access, refresh } = await login(phoneNumber, password);
      if (rememberMe) {
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
      } else {
        sessionStorage.setItem('access', access);
        sessionStorage.setItem('refresh', refresh);
      }
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');

    if (token) {
      router.push('/');
    }
  }, [router]);
  
  return (
<div className="h-screen flex">
  <div className="hidden sm:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center">
    <div>
      <h1 className="text-white font-bold text-4xl font-sans">Berchi</h1>
      <p className="text-white mt-1">Unleash your Apetite</p>
      <button type="submit" className="block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2">Read More</button>
    </div>
  </div>
  <div className="flex w-screen sm:w-1/2 justify-center items-center bg-white">
    <form className="bg-white" onSubmit={handleSubmit}>
      <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello Again!</h1>
      <p className="text-sm font-normal text-gray-600 mb-7">Welcome Back</p>
      <Input className=" outline-none  border-2 rounded-2xl mb-4"  placeholder="Phone" onChange={(e) => setPhoneNumber(e.target.value)} startContent={<PhoneIcon className='text-default-500 size-6'/>} />

      <Input  className="outline-none   border-2 rounded-2xl mb-4"  placeholder="Password"onChange={(e) => setPassword(e.target.value)} startContent={<KeyIcon className='text-default-500 size-6'/>}       endContent={
        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
          {isVisible ? (
            <EyeSlashIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"} />
      <Checkbox
        isSelected={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
      >
        Remember me
      </Checkbox>

      <Button type="submit" className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white  mb-2">Login</Button>
      <Link className="text-sm ml-2 hover:text-blue-500 cursor-pointer">Forgot Password ?</Link>
    </form>
  </div>
</div>
  );
}
