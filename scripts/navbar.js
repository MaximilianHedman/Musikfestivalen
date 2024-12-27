const createNavbar = () => {
    // Get the navbar container
    const navbar = document.getElementById("navbar");

    // Create the logo
    const logo = document.createElement("a");
    logo.classList.add("navbar-logo");
    logo.textContent = "Musikfestivalen";
    logo.href = "#";

    // Create the menu container
    const menu = document.createElement("div");
    menu.classList.add("navbar-menu");

    // Define the menu items
    const menuItems = [
        { text: "Home", href: "#" },
        { text: "Artists", href: "#artists" },
        { text: "Schedule", href: "#schedule" },
        { text: "Contact", href: "#contact" },
    ];

    // Add menu items to the menu container
    menuItems.forEach((item) => {
        const link = document.createElement("a");
        link.textContent = item.text;
        link.href = item.href;
        menu.appendChild(link);
    });

    // Append the logo and menu to the navbar
    navbar.appendChild(logo);
    navbar.appendChild(menu);
};

createNavbar();