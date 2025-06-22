"use client";

import Image from "next/image";
import { FaQuoteLeft, FaQuoteRight, FaUserGraduate, FaRocket } from "react-icons/fa";

const quotes = [
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
    author: "Albert Schweitzer",
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
  },
  {
    text: "Don't let what you cannot do interfere with what you can do.",
    author: "John Wooden",
  },
  {
    text: "The only way to achieve the impossible is to believe it is possible.",
    author: "Charles Kingsleigh (Alice in Wonderland)",
  },
  {
    text: "Our greatest glory is not in never falling, but in rising every time we fall.",
    author: "Confucius",
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "Strive for progress, not perfection.",
    author: "Unknown",
  },
];

export default function GrowthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-100 flex flex-col items-center py-10 px-4">
      <div className="flex flex-col items-center mb-8">
        <Image src="/images/seslogo.jpg" alt="SES School Logo" width={80} height={80} className="rounded-xl mb-2" />
        <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2 mb-2">
          <FaRocket className="text-blue-500" /> Growth & Motivation
        </h1>
        <p className="text-gray-600 text-center max-w-xl">
          Welcome to the Growth page! Here you'll find words of wisdom from some of the world's greatest minds. Let these quotes inspire you to keep pushing forward, even when things get tough. Remember, your academic journey is a marathon, not a sprint—so keep growing, keep learning, and never give up!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {quotes.map((q, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border-t-4 border-green-300 hover:shadow-2xl transition">
            <div className="flex items-center gap-2 text-green-500">
              <FaQuoteLeft />
              <span className="font-semibold text-lg">Motivation #{i + 1}</span>
            </div>
            <p className="text-gray-800 text-lg italic">{q.text}</p>
            <div className="flex items-center gap-2 text-blue-600 mt-2">
              <FaUserGraduate />
              <span className="font-semibold">{q.author}</span>
            </div>
            <div className="flex justify-end text-green-300 text-2xl">
              <FaQuoteRight />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 