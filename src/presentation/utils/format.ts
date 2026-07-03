
export const capitalize = (value: string): string =>
  value.length === 0 ? value : value.charAt(0).toUpperCase() + value.slice(1);

export const formatName = (name: string): string => name.split('-').map(capitalize).join(' ');

export const formatPokedexNumber = (id: number): string => `#${String(id).padStart(3, '0')}`;

export const formatMeters = (meters: number): string => `${meters.toFixed(1)} m`;

export const formatKilograms = (kilograms: number): string => `${kilograms.toFixed(1)} kg`;
