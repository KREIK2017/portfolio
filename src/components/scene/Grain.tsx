/**
 * Зерно плівки й вінʼєтка. Обидва шари поверх усього, але
 * pointer-events вимкнені в CSS, тож кліки проходять наскрізь.
 */
export function Grain() {
  return (
    <>
      <svg className="grain" aria-hidden="true" focusable="false">
        <filter id="filmGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#filmGrain)" />
      </svg>

      <div className="vignette" aria-hidden="true" />
    </>
  );
}
