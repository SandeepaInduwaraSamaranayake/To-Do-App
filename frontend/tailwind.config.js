/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  safelist: [
    // Force include all classes used in the project
    {
      pattern: /^(bg-|text-|border-|shadow-|rounded-|p-|px-|py-|m-|mx-|my-|w-|h-|min-h-|max-w-|flex|grid|items-|justify-|gap-|space-|transition-|duration-|hover:|focus:|disabled:)/,
    },
    'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-blue-600', 'bg-blue-700', 'bg-red-100',
    'text-white', 'text-gray-800', 'text-gray-500', 'text-gray-900', 'text-gray-700', 'text-red-700', 'text-blue-600',
    'border-gray-300', 'border-red-400', 'border-blue-500', 'border-transparent', 'border-dashed',
    'p-4', 'p-5', 'p-8', 'p-12', 'px-4', 'py-2', 'py-3', 'pb-3', 'mb-1', 'mb-8', 'ml-4',
    'rounded-xl', 'rounded-lg', 'rounded',
    'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-md', 'shadow-sm',
    'w-full', 'h-5', 'h-fit', 'min-h-screen', 'max-w-7xl',
    'flex', 'flex-shrink-0', 'grid', 'grid-cols-1', 'lg:grid-cols-2',
    'items-center', 'items-start', 'justify-between', 'justify-center',
    'gap-8', 'lg:gap-12', 'space-x-2', 'space-y-5', 'space-y-6',
    'sticky', 'top-8', 'relative', 'block',
    'font-sans', 'font-bold', 'font-medium', 'font-extrabold',
    'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-3xl',
    'transition-all', 'transition-colors', 'duration-200',
    'hover:bg-blue-700', 'hover:shadow-xl', 'hover:scale-[1.01]',
    'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'focus:outline-none', 'focus:ring-offset-2',
    'disabled:opacity-50', 'resize-none', 'animate-spin'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}