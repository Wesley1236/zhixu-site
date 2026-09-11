import {useEffect} from 'react';
export default function AmbientEffects(){useEffect(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
 const parallax=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>document.documentElement.style.setProperty('--scene-offset',reduced.matches?'0px':`${Math.min(scrollY*.055,48)}px`))};
 const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>target.classList.toggle('is-visible',isIntersecting)),{threshold:.06});
 const scan=()=>{document.querySelectorAll('.studio-panel:not(.scroll-reveal),.orbit-focus:not(.scroll-reveal),.orbit-right>section:not(.scroll-reveal),.orbit-bottom:not(.scroll-reveal)').forEach(el=>{el.classList.add('scroll-reveal');observer.observe(el)})};scan();
 const mutation=new MutationObserver(scan);mutation.observe(document.getElementById('root'),{childList:true,subtree:true});window.addEventListener('scroll',parallax,{passive:true});reduced.addEventListener('change',parallax);
 return()=>{observer.disconnect();mutation.disconnect();cancelAnimationFrame(frame);document.querySelectorAll('.scroll-reveal').forEach(el=>el.classList.remove('scroll-reveal','is-visible'));window.removeEventListener('scroll',parallax);reduced.removeEventListener('change',parallax);document.documentElement.style.removeProperty('--scene-offset')};
 },[]);return null}
