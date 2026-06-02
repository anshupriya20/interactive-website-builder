// "use client";

// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";

// export default function Hero() {
//   const heroRef = useRef(null);

//   useEffect(() => {
//     gsap.from(heroRef.current, {
//       opacity: 0,
//       y: 50,
//       duration: 1,
//     });
//   }, []);

//   return (
//     <section ref={heroRef}>
//       ...
//     </section>
//   );
// }