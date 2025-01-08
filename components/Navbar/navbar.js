document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById("navbar");

    const menuItems = [
        { text: "Home", href: "#" },
        { text: "Artists", href: "#artists" },
        { text: "Schedule", href: "#schedule" },
        { text: "Contact", href: "#contact" }
    ];

    const navbarHTML = `
        <a class="navbar-logo" href="#">Musikfestivalen</a>
        <div class="navbar-menu">
            ${menuItems.map(item => `<a href="${item.href}">${item.text}</a>`).join('')}
        </div>
    `;

    navbar.innerHTML = navbarHTML;
});
