import "vuetify/styles";
import type { FunctionalComponent } from "vue";
import { createVuetify, type IconSet, type IconProps } from "vuetify";
import { en, zhHans } from "vuetify/locale";
import { useDark } from "@vueuse/core";
import { aliases, fa } from "vuetify/iconsets/fa";
import { mdi } from "vuetify/iconsets/mdi";

function filename(path: string) {
  return path
    .split(/(\\|\/)/g)
    .pop()!
    .replace(/\.[^/.]+$/, "");
}

const svgIcons = Object.fromEntries(
  Object.entries(
    import.meta.glob<FunctionalComponent>("@/assets/icons/*.svg", {
      eager: true,
      import: "default",
      as: "component",
    })
  ).map(([k, v]) => [filename(k), v])
);
const custom: IconSet = {
  component: (props: IconProps) =>
    h(props.tag, [h(svgIcons[props.icon as string])]),
};

const theme = {
  primary: localStorage.getItem("theme-primary") || "#1697f6",
  secondary: "#03A9F4",
  accent: "#9C27b0",
  info: "#00CAE3",
};

export default createVuetify({
  locale: {
    locale: "zhHans",
    fallback: "en",
    messages: { zhHans, en },
  },
  defaults: {
    VSwitch: {
      color: "primary",
    },
  },
  theme: {
    defaultTheme: useDark().value ? "dark" : "light",
    themes: {
      light: {
        colors: theme,
      },
      dark: {
        colors: theme,
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi, custom, fa },
  },
  display: {
    mobileBreakpoint: "sm",
  },
});
