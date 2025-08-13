"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface GreetingProps {
  name?: string;
}

export default function Greeting({ name = "User" }: GreetingProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
     
      <DotLottieReact
      src="https://lottie.host/2744d596-87dc-43ef-ab34-8d2d32ae3097/1aJ9cbHjTS.lottie"
      loop
      autoplay
      style = {{width: "100%", height: "50%"}}
    />

      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-100">
          Hi there, {name}
        </h1>
        <p className="text-slate-300">
          How can I help you today?
        </p>
      </div>
    </div>
  );
}