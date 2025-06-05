import React from 'react';
import { Loader2 } from 'lucide-react';
export default function Loader({title}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 border border-primary/20">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <span className="text-primary font-medium">{title}</span>
      </div>
    </div>
  )
}