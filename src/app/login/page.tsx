// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Input,
  Button,
  Tabs,
  Tab,
  Link,
  Checkbox,
  Card,
  CardBody,
} from '@nextui-org/react';
import { login, signup } from '../../services/api';
import {
  PhoneIcon,
  KeyIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/solid';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'login';
  const [selected, setSelected] = useState(initialTab);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    router.push(`?tab=${selected}`);
  }, [selected, router]);

  useEffect(() => {
    const token =
      localStorage.getItem('access') || sessionStorage.getItem('access');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e: React.FormEvent) => {
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      const { access, refresh } = await signup({
        phone_number: phoneNumber,
        name:name,
        password:password,
        re_password:confirmPassword
      });
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex">
      <div className="hidden sm:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">Berchi</h1>
          <p className="text-white mt-1">Unleash your Appetite</p>
          <button
            type="button"
            className="block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2"
          >
            Read More
          </button>
        </div>
      </div>
      <div className="flex w-screen sm:w-1/2 justify-center items-center bg-white">
        <Card className="max-w-full w-[340px]">
          <CardBody>
            <Tabs
              fullWidth
              size="md"
              aria-label="Tabs form"
              selectedKey={selected}
              onSelectionChange={setSelected}
            >
              <Tab key="login" title="Login">
                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                  <Input
                    isRequired
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    type="tel"
                    startContent={<PhoneIcon className="text-default-500 size-6" />}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <Input
                    isRequired
                    label="Password"
                    placeholder="Enter your password"
                    type={isVisible ? 'text' : 'password'}
                    startContent={<KeyIcon className="text-default-500 size-6" />}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeSlashIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Checkbox
                    isSelected={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  >
                    Remember me
                  </Checkbox>
                  <Button type="submit" fullWidth color="primary">
                    Login
                  </Button>
                  <p className="text-center text-small">
                    Need to create an account?{' '}
                    <Link size="sm" onPress={() => setSelected('sign-up')}>
                      Sign up
                    </Link>
                  </p>
                </form>
              </Tab>
              <Tab key="sign-up" title="Sign up">
                <form className="flex flex-col gap-4" onSubmit={handleSignup}>
                  <Input
                    isRequired
                    label="Full Name"
                    placeholder="Enter your full name"
                    type="text"
                    startContent={<UserIcon className="text-default-500 size-6" />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    isRequired
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    type="tel"
                    startContent={<PhoneIcon className="text-default-500 size-6" />}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <Input
                    isRequired
                    label="Password"
                    placeholder="Enter your password"
                    type={isVisible ? 'text' : 'password'}
                    startContent={<KeyIcon className="text-default-500 size-6" />}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeSlashIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    isRequired
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    type={isVisible ? 'text' : 'password'}
                    startContent={<KeyIcon className="text-default-500 size-6" />}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button type="submit" fullWidth color="primary">
                    Sign up
                  </Button>
                  <p className="text-center text-small">
                    Already have an account?{' '}
                    <Link size="sm" onPress={() => setSelected('login')}>
                      Login
                    </Link>
                  </p>
                </form>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
