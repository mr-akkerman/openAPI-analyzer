import React from "react";
import PropTypes from 'prop-types';

export const Alert = React.forwardRef(({ className = '', variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-gray-800 text-gray-100",
    destructive: "bg-red-900/90 text-red-100",
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={`relative w-full rounded-lg border border-gray-700 p-4 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export const AlertDescription = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  >
    {children}
  </div>
));

Alert.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'destructive']),
  children: PropTypes.node,
};

AlertDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

Alert.displayName = "Alert";
AlertDescription.displayName = "AlertDescription";