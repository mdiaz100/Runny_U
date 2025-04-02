document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("query")?.toLowerCase();

    const restaurants = [
        { name: "Sr.Gourmet", image: "../assets/logos/srgourmet.jpg", link: "menu_srgourmet.html" },
        { name: "Dogger", image: "../assets/logos/dogger.jpg", link: "menu_dogger.html" },
        { name: "Pimiento'z", image: "../assets/logos/pimientoz.jpg", link: "menu_pimientoz.html" },
        { name: "Nativos", image: "../assets/logos/nativos.jpg", link: "menu_nativos.html" },
    ];

    const resultsContainer = document.getElementById("results-container");

    if (query) {
        const filteredRestaurants = restaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(query)
        );

        if (filteredRestaurants.length > 0) {
            filteredRestaurants.forEach(restaurant => {
                const div = document.createElement("div");
                div.classList.add("restaurant-card");
                div.innerHTML = `
                    <div class="restaurant-img" style="background-image: url('${restaurant.image}');"></div>
                    <div class="restaurant-info">
                        <h3>${restaurant.name}</h3>
                        <a href="${restaurant.link}" class="view-menu">Ver menú</a>
                    </div>
                `;
                resultsContainer.appendChild(div);
            });
        } else {
            resultsContainer.innerHTML = `<p>No se encontraron restaurantes con el nombre "<strong>${query}</strong>"</p>`;
        }
    }
});
