import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-2xl uppercase">

      <h1>Welcome to the Expense Tracker </h1>

      <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Get Started</button>
    </div>
  )
}
