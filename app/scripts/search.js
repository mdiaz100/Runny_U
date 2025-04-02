document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que el formulario recargue la página

        const query = searchInput.value.trim(); // Obtiene el valor del input

        if (query) {
            // Redirige a search.html con el término de búsqueda en la URL
            window.location.href = `search.html?query=${encodeURIComponent(query)}`;
        }
    });
});
