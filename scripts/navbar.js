const createNavbar = () => {
    const navbar = document.getElementById("navbar");

    const logo = document.createElement("a");
    logo.classList.add("navbar-logo");
    logo.textContent = "Musikfestivalen";
    logo.href = "#";

    const menu = document.createElement("div");
    menu.classList.add("navbar-menu");

    const menuItems = [
        { text: "Home", href: "#" },
        { text: "Artists", href: "#artists" },
        { text: "Schedule", href: "#schedule" },
        { text: "Contact", href: "#contact" },
    ];

    menuItems.forEach((item) => {
        const link = document.createElement("a");
        link.textContent = item.text;
        link.href = item.href;
        menu.appendChild(link);
    });

    navbar.appendChild(logo);
    navbar.appendChild(menu);
};

createNavbar();