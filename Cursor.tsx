import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Cursor.module.css'

const Cursor: React.FC = () => {
  const [widthMatches, setWidthMatches] = useState<boolean | undefined>(undefined);
  const cursorRef = useRef<HTMLDivElement>(null);
  const bigBallRef = useRef<HTMLDivElement>(null);
  const smallBallRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      const mediaQuery = window.matchMedia('(min-width: 768px)');
      const handleChange = (e: MediaQueryListEvent) => {
        setWidthMatches(e.matches);
      };
      setWidthMatches(mediaQuery.matches); 
      mediaQuery.addEventListener('change', handleChange);
      bodyRef.current = document.body;
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);

  useEffect(() => {
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setWidthMatches(e.matches);
      if (e.matches) {
        if (bodyRef.current) {
          bodyRef.current.style.cursor = 'none';
        }
      } else {
        if (bodyRef.current) {
          bodyRef.current.style.cursor = '';
        }
        if (cursorRef.current) {
          cursorRef.current.style.display = 'none';
        }
      }
    };
    // @ts-ignore
    const mediaQuery = window?.matchMedia('(min-width: 768px)');
    // @ts-ignore
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    const handleMouseMove = (e: MouseEvent) => {
      if (widthMatches && cursorRef.current) {
        cursorRef.current.style.display = 'block';
    
        if (bigBallRef.current && smallBallRef.current) {
          gsap.to(bigBallRef.current, {
            x: e.clientX - 15,
            y: e.clientY - 15,
            duration: 0.4,
            ease: 'ease-in-out',
          });

          gsap.to(smallBallRef.current, {
            x: e.clientX - 5,
            y: e.clientY - 5,
            duration: 0.1,
          });
        }
      }
    };

    const handleMouseHover = () => {
      if (bigBallRef.current) {
        gsap.to(bigBallRef.current, {
          scale: 2,
          duration: 0.3,
        });
      }
    
    };

    const handleMouseHoverOut = () => {
      if (bigBallRef.current) {
        gsap.to(bigBallRef.current, {
          scale: 1,
          duration: 0.3,
        });
      }
    
    };

    if (bodyRef.current) {
      bodyRef.current.addEventListener('mousemove', handleMouseMove);
    }

    // note: this may affect performance if there's a lot of buttons
    const hoverableElements = document.querySelectorAll<HTMLElement>('button');
    hoverableElements.forEach((element) => {
      element.addEventListener('mouseenter', handleMouseHover);
      element.addEventListener('mouseleave', handleMouseHoverOut);
    });

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
      if (bodyRef.current) {
        bodyRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      hoverableElements.forEach((element) => {
        element.removeEventListener('mouseenter', handleMouseHover);
        element.removeEventListener('mouseleave', handleMouseHoverOut);
      });
    };
  }, [widthMatches]);

  return (
    <>
      <div className={styles.cursor} ref={cursorRef}>
        <div className={styles.cursorBall} ref={bigBallRef}>
          <svg height="30" width="30">
            <circle className={styles.circle} cx="15" cy="15" r="15" strokeWidth="0" />
          </svg>
        </div>
        <div className={styles.cursorBall} ref={smallBallRef}>
          <svg height="10" width="10">
            <circle className={styles.circle} cx="5" cy="5" r="5" strokeWidth="0" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Cursor;
