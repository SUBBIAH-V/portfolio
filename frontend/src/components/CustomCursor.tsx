import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailPosition, setTrailPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    // Track clickable element hover states
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, textarea, select, [role="button"], .clickable-card')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };
    window.addEventListener('mouseover', handleElementHover);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleElementHover);
    };
  }, [isVisible]);

  // Smooth trail effect
  useEffect(() => {
    let animationFrameId: number;
    const followMouse = () => {
      setTrailPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.2,
        y: prev.y + (position.y - prev.y) * 0.2,
      }));
      animationFrameId = requestAnimationFrame(followMouse);
    };
    animationFrameId = requestAnimationFrame(followMouse);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Sharp Dot */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-transform duration-100 ease-out ${
          isHovered ? 'w-3 h-3 bg-blue-400 shadow-glow scale-125' : 'w-2 h-2 bg-blue-500'
        } ${isClicked ? 'scale-75' : ''}`}
        style={{
          transform: `translate3d(${position.x - (isHovered ? 6 : 4)}px, ${position.y - (isHovered ? 6 : 4)}px, 0)`,
        }}
      />

      {/* Trailing Outer Ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-40 rounded-full border transition-all duration-300 ${
          isHovered
            ? 'w-12 h-12 border-blue-400/60 bg-blue-500/10 backdrop-blur-[1px] -translate-x-6 -translate-y-6 scale-110'
            : 'w-8 h-8 border-slate-400/30 -translate-x-4 -translate-y-4'
        } ${isClicked ? 'scale-90 border-blue-500' : ''}`}
        style={{
          transform: `translate3d(${trailPosition.x}px, ${trailPosition.y}px, 0) translate(${
            isHovered ? '-24px, -24px' : '-16px, -16px'
          })`,
        }}
      />
    </>
  );
};
