const Footer = () => {
  return (
    <footer className='p-4 mb-auto bg-gray-100 md:p-8 lg:p-10 dark:bg-gray-900'>
      <div className='mx-auto max-w-screen-xl text-center'>
        <a href='/' className='flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white'>
          Terms of Service
        </a>
        <p className='my-6 text-gray-500 dark:text-gray-400'>
          Not all products, pricing, and services are available in all areas. Pricing and actual speeds may vary. Internet speeds based on wired
          connection. Restrictions apply.
        </p>
        <ul className='flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white'>
          <li>
            <a href='/' className='mr-4 hover:underline md:mr-6'>
              Home
            </a>
          </li>
          <li>
            <a href='/' className='mr-4 hover:underline md:mr-6'>
              Accessibility
            </a>
          </li>
          <li>
            <a href='/' className='mr-4 hover:underline md:mr-6'>
              Privacy Policy
            </a>
          </li>
          <li>
            <a href='/' className='mr-4 hover:underline md:mr-6'>
              Contact Us
            </a>
          </li>
        </ul>
        <span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
          © 2025 Made by{' '}
          <a href='https://www.rulesys.com/' className='hover:underline'>
            Lei Zhong
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
