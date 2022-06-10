import { useEffect, useState } from "react";
import { getTheme, setTheme as setLocalTheme } from "services/localStorage";

const addThemeAttribute = (theme: "dark" | "light") => {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.classList.add(theme);
};

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">();
  useEffect(() => {
    const preferSchema = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const defaultTheme = getTheme() || preferSchema;
    addThemeAttribute(defaultTheme);
    setTheme(defaultTheme);
  }, []);

  const changeTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setLocalTheme(newTheme);
    addThemeAttribute(newTheme);
    document.documentElement.classList.remove(theme!);
  };

  return (
    <div className="form-control lg:mr-4 md:ml-auto">
      <label className="cursor-pointer label">
        <span className="label-text">🌞</span>
        <input
          type="checkbox"
          className="toggle toggle-secondary mx-1"
          data-act-class="active"
          checked={theme === "dark"}
          onClick={() => changeTheme()}
          readOnly
        />
        <span className="label-text">🌚</span>
      </label>
    </div>
  );
}

export default ThemeToggle;
