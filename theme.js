window.ThemeToggle = class ThemeToggle {
  constructor() {
    this.currentTheme = this.getStoredTheme() || "light";
    this.themeToggle = document.getElementById("themeToggle");
    this.themeIcon = document.getElementById("themeIcon");
    this.themeText = document.getElementById("themeText");

    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);

    this.themeToggle.addEventListener("click", () => {
      this.toggleTheme();
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(this.currentTheme);
    this.storeTheme(this.currentTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    if (theme === "dark") {
      this.themeIcon.textContent = "☀️";
      this.themeText.textContent = "Light Mode";
    } else {
      this.themeIcon.textContent = "🌙";
      this.themeText.textContent = "Dark Mode";
    }
  }

  storeTheme(theme) {
    localStorage.setItem("theme", theme);
  }

  getStoredTheme() {
    return localStorage.getItem("theme");
  }
};
