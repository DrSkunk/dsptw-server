import App from "./App.svelte";
import "./app.css";
import "@fontsource/barlow-condensed/400.css";

const app = new App({
  target: document.getElementById("app"),
  props: {
    template: document.template,
  },
});

export default app;
