import React, { useEffect, useState } from "react";

interface ComponentLoaderProps {
  component: React.ReactNode;
  isComponentOpen: boolean;
}

const ComponentLoader = ({ component, isComponentOpen }: ComponentLoaderProps) => {
  const [componentLoaded, setComponentLoaded] = useState(false);

  useEffect(() => {
    if (isComponentOpen) {
      handleShowingComponent();
    }
  }, [isComponentOpen]);

  const handleShowingComponent = () => {
    if (!componentLoaded) {
      setComponentLoaded(true);
    }
  };
  return <>{componentLoaded && component}</>;
};

export default ComponentLoader;
