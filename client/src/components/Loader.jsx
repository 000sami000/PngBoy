import React, { useState, useEffect } from 'react';

function Loader({small}) {
  const [loading, setLoading] = useState(true);

  // Simulate loading after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
    //   setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-[black]"
  role="status">
  <span
    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
    >Loading...</span
  >
</div>
  );
}

export default Loader;
