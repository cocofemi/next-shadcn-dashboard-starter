import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from './user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import warehouse from '../../../public/images/ashley-28b8xlTT5t4-unsplash.jpg';
import Image from 'next/image';
import logo from '../../../public/images/mehchant_logo_v3.png';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://img.freepik.com/premium-vector/abstract-african-art-shapes-seamless-background-tribal-geometric-decoration-pattern_454705-744.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="relative z-20 flex w-72 items-center rounded-md bg-white p-2 text-lg font-medium text-black shadow-lg">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg> */}
          <Image src={logo} alt="mechant_logo" width={120} height={20} />
          <span className="mb-1 text-xl font-bold text-gray-500">
            Store Manager
          </span>
        </div>
        <div className="absolute inset-0 z-20 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/40 to-transparent p-10">
          <blockquote className="space-y-2 text-white">
            <p className="text-lg font-bold italic">
              &ldquo;You don’t have to be great to start, but you have to start
              to be great.&rdquo;
            </p>
            <footer className="text-sm">— Zig Ziglar</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="lg:hidden">
              <Image src={logo} alt="mehchant_logo" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password below to login to your account
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
