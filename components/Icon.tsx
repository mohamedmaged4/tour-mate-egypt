
// components/Icon.tsx

import React from 'react';
import { IconProps } from '../types';

/**
 * A simple wrapper component for displaying Font Awesome icons.
 * This helps maintain consistency and makes it easier to change icon libraries in the future.
 * @param name The Font Awesome icon name (e.g., 'fa-solid fa-star').
 * @param className Additional CSS classes to apply to the icon.
 */
const Icon: React.FC<IconProps> = ({ name, className }) => {
  return <i className={`${name} ${className || ''}`} />;
};

export default Icon;
