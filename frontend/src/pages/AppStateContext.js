import React, { createContext, useState } from 'react';
import round_metal_preview from '../resources/round_metal_preview.png';
import wayfarer_ease_preview from '../resources/wayfarer_ease_preview.png';
import aviator_preview from '../resources/aviator_preview.png';

export const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [sphOD, setSphOD] = useState('');
  const [cylOD, setCylOD] = useState('');
  const [axisOD, setAxisOD] = useState('');
  const [sphOS, setSphOS] = useState('');
  const [cylOS, setCylOS] = useState('');
  const [axisOS, setAxisOS] = useState('');
  const [pd, setPD] = useState(63);
  const [prescription, setPrescription] = useState({});
  const [material, setMaterial] = useState('Standard Plastic - 1.5');
  const [frameID, setFrameID] = useState('ray_ban_round_metal');
  const [active, setActive] = useState(0);
  const [isReady, setReady] = useState(false)

  const glassMaterials = ['Crown Glass - 1.52', 'Flint Glass - 1.6'];
  const plasticMaterials = ['Standard Plastic - 1.5', 'Polycarbonate - 1.59', 'High-index Plastic - 1.57', 'High-index Plastic - 1.67', 'High-index Plastic - 1.74'];
  const frames = [
    {
      id: 'ray_ban_round_metal',
      src: round_metal_preview,
      name: 'Ray Ban Round Metal',
      material: 'Metal'
    },
    {
      id: 'ray_ban_wayfarer_ease',
      src: wayfarer_ease_preview,
      name: 'Ray Ban Wayfarer Ease',
      material: 'Propionate'
    },
    {
      id: 'ray_ban_aviator_classic',
      src: aviator_preview,
      name: 'Ray Ban Aviator Classic',
      material: 'Metal'
    }
  ]

  // The value that will be provided to any consuming components
  const value = {
    sphOD, setSphOD,
    cylOD, setCylOD,
    axisOD, setAxisOD,
    sphOS, setSphOS,
    cylOS, setCylOS,
    axisOS, setAxisOS,
    pd, setPD,
    prescription, setPrescription,
    material, setMaterial,
    frameID, setFrameID,
    active, setActive,
    isReady, setReady,
    glassMaterials,
    plasticMaterials,
    frames
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};
