import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { responsive } from '../tokens';

type Breakpoint = keyof typeof responsive.breakpoints;

/**
 * Hook para detectar breakpoint atual baseado na largura da tela
 * Otimizado para React Native
 */
export function useResponsive() {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const width = dimensions.width;

  const currentBreakpoint =
    (Object.entries(responsive.breakpoints)
      .reverse()
      .find(([, breakpoint]) => width >= breakpoint)?.[0] as Breakpoint) || 'xs';

  return {
    width,
    breakpoint: currentBreakpoint,
    isXs: currentBreakpoint === 'xs',
    isSm: ['xs', 'sm'].includes(currentBreakpoint),
    isMd: ['xs', 'sm', 'md'].includes(currentBreakpoint),
    isLg: ['xs', 'sm', 'md', 'lg'].includes(currentBreakpoint),
    isXl: true, // xl and above
    isMobile: width < responsive.breakpoints.md,
    isTablet: width >= responsive.breakpoints.md && width < responsive.breakpoints.lg,
    isDesktop: width >= responsive.breakpoints.lg,
  };
}

/**
 * Obtém valor responsivo baseado no breakpoint
 */
export function useResponsiveValue<T>(values: Record<Breakpoint, T>): T {
  const { breakpoint } = useResponsive();
  return values[breakpoint];
}
