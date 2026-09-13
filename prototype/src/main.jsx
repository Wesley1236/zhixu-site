import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./home.css";
import "./home-v4.css";
import "./hub-light.css";
import "./expression.css";
import "./studio.css";
import "./evening-v13.css";
import "./study-v14.css";
import "./clear-glass.css";
import "./reader-v15.css";
import {LocaleProvider} from './Locale';
import AmbientEffects from './AmbientEffects';
function Ready({children}){React.useEffect(()=>{document.body.classList.add('app-ready');},[]);return children;}
class LoadBoundary extends React.Component{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(){document.body.classList.add('app-ready');}
 render(){return this.state.failed?<section style={{padding:40,font:'18px/1.8 system-ui'}}><h1>书房暂时没能打开</h1><p>请重新加载。不会删除你的书籍或笔记。</p><button onClick={()=>location.reload()}>重新加载</button></section>:this.props.children;}
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadBoundary><LocaleProvider><Ready><App /><AmbientEffects /></Ready></LocaleProvider></LoadBoundary>
  </React.StrictMode>,
);
