'use client';

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Image from 'next/image';

interface LoaderProps {
  logo?: { url: string };
}

export default function Loader({ logo }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1412]">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          {logo?.url && logo.url.trim() !== '' ? (
            <div style={{
              filter: 'drop-shadow(0 0 20px rgba(250, 212, 91, 0.3))',
            }}>
              <Image
                src={logo.url}
                alt="Au Lait"
                width={100}
                height={100}
                className="opacity-90"
                style={{
                  width: 'auto',
                  height: '100px'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-[#fad45b]/20 rounded-full flex items-center justify-center">
              <div className="text-3xl font-bold text-[#fad45b]">☕</div>
            </div>
          )}
        </div>

        {/* Lottie Animation as Progress Indicator */}
        <div className="flex justify-center">
          <div className="w-32 h-32 flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/7ebe5f2c-2222-4c80-b61b-227f3915b26a/9Oy4K3ZUB2.lottie"
              loop
              autoplay
            />
          </div>
        </div>
      </div>
    </div>
  );
}
