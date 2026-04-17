'use client';

import React from 'react';

const cleanProps = (props = {}) => {
  const {
    initial,
    animate,
    transition,
    whileInView,
    viewport,
    whileHover,
    whileTap,
    exit,
    layout,
    variants,
    ...rest
  } = props;

  return rest;
};

export const motion = new Proxy(
  {},
  {
    get: (_, tag) => {
      const Component = React.forwardRef((props, ref) => React.createElement(tag, { ...cleanProps(props), ref }, props.children));
      Component.displayName = `Motion(${String(tag)})`;
      return Component;
    }
  }
);
