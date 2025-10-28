import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('ClipForge starting...', 'React:', React.version);

const container = document.getElementById('root');
console.log('Root container:', container);

const root = createRoot(container);
console.log('Root created, rendering App...');

root.render(<App />);
console.log('App rendered!');
