"use client";

import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Фільтри «жива олія»: шум зсуває пікселі полотна, і мазки тремтять —
 * ніби фарба ще не висохла.
 *
 * Тут два фільтри, і це головне рішення файлу.
 *
 * Кожна зміна baseFrequency змушує браузер перерахувати feTurbulence на
 * CPU, а таких полотен на сторінці тринадцять. Тому:
 *
 * — #livingOil (фоновий) міняє шум дискретно. Рух ледь помітний, зате
 *   тринадцять карток разом майже нічого не коштують.
 * — #livingOilFlow (наведення) інтерполює плавно й дає справжні 60fps,
 *   але застосовується лише до картки під курсором. Невикористаний
 *   фільтр браузер не обчислює взагалі, тому решта дванадцять у цей час
 *   не платять нічого.
 *
 * Разом виходить дешевше за колишні п'ять дискретних кроків на всіх — і
 * при цьому саме там, куди людина дивиться, рух повністю плавний.
 *
 * При prefers-reduced-motion вузли <animate> не рендеряться взагалі.
 * Підхід «поставити dur у 999999s» руху не зупиняє: значення
 * продовжує інтерполюватися, а фільтр — перемальовуватися.
 */
export function LivingOilFilter() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <svg className="filter-defs" aria-hidden="true" focusable="false">
      {/* ── Фоновий: рідко, дешево ─────────────────────────────── */}
      <filter id="livingOil" x="-12%" y="-12%" width="124%" height="124%">
        <feTurbulence
          type="fractalNoise"
          numOctaves={2}
          seed={7}
          baseFrequency="0.015 0.02"
          result="noise"
        >
          {!reducedMotion && (
            <animate
              attributeName="baseFrequency"
              dur="14s"
              repeatCount="indefinite"
              calcMode="discrete"
              values="0.0150 0.0200; 0.0156 0.0197; 0.0162 0.0193; 0.0168 0.0189;
                      0.0174 0.0185; 0.0180 0.0181; 0.0186 0.0177; 0.0190 0.0172;
                      0.0186 0.0168; 0.0180 0.0165; 0.0174 0.0169; 0.0168 0.0174;
                      0.0162 0.0179; 0.0156 0.0184; 0.0152 0.0190; 0.0150 0.0195;
                      0.0148 0.0198; 0.0150 0.0200"
            />
          )}
        </feTurbulence>

        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={12}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      {/* ── Наведення: плавно, лише на одній картці ─────────────── */}
      <filter id="livingOilFlow" x="-12%" y="-12%" width="124%" height="124%">
        {/*
          numOctaves={1} замість двох: один шар шуму вдвічі дешевший, а
          на дрібному зсуві різниця в деталізації не читається.
        */}
        <feTurbulence
          type="fractalNoise"
          numOctaves={1}
          seed={7}
          baseFrequency="0.015 0.02"
          result="noise"
        >
          {!reducedMotion && (
            <animate
              attributeName="baseFrequency"
              dur="7s"
              repeatCount="indefinite"
              values="0.015 0.02; 0.019 0.016; 0.016 0.021; 0.015 0.02"
            />
          )}
        </feTurbulence>

        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={14}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
