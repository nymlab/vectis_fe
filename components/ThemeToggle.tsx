import { useEffect, useMemo, useState } from "react";
import { getTheme, setTheme as setLocalTheme } from "services/localStorage";

const addThemeAttribute = (theme: "dark" | "light") => {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.classList.add(theme);
};

interface Props {
  size: number;
}

function ThemeToggle({ size }: Props) {
  const [theme, setTheme] = useState<"dark" | "light">();
  useEffect(() => {
    const preferSchema = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const defaultTheme = getTheme() || preferSchema;
    addThemeAttribute(defaultTheme);
    setTheme(defaultTheme);
  }, []);

  const isDarkMode = useMemo(() => theme === "dark", [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setLocalTheme(newTheme);
    addThemeAttribute(newTheme);
    document.documentElement.classList.remove(theme!);
  };

  return (
    <button onClick={() => toggleTheme()} className="cursor-pointer hover:text-gray-300 focus:outline-none dark:focus:ring-gray-700">
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 20 20"
        aria-hidden="true"
        height={size}
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        {isDarkMode ? (
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        ) : (
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>
        )}
      </svg>
    </button>
  );
}

export default ThemeToggle;
